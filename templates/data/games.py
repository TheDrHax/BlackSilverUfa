#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from datetime import datetime

from .streams import streams, SegmentReference
from ..utils import load_json, join, json_escape, indent


class Game:
    def __init__(self, **kwargs):
        self.name = kwargs['name']
        self.category = kwargs['category']
        self.type = kwargs.get('type')
        self.id = kwargs['id']
        self.streams = []
        self.thumb_index = kwargs.get('thumbnail') or 0

        for segment in kwargs['streams']:
            parent = streams[segment['twitch']][segment.get('segment') or 0]
            ref = SegmentReference(parent, game=self, **segment)
            ref.parent.references.add(ref)
            ref.stream.games.append((self, ref))
            self.streams.append(ref)

    def stream_count(self):
        return len(set([s.twitch for s in self.streams]))

    @property
    def thumbnail(self):
        return self.streams[self.thumb_index].thumbnail
    
    @property
    def filename(self):
        return f'/links/{self.id}.html'

    @property
    def _unix_time(self):
        return self.streams[self.thumb_index].stream._unix_time

    @property
    def date(self):
        return datetime.fromtimestamp(self._unix_time)

    @join()
    def to_json(self):
        keys = ['name', 'category', 'type', 'id', 'streams', 'thumbnail']

        yield '{\n  '

        first = True
        for key in keys:
            if key == 'thumbnail':
                if self.thumb_index != 0:
                    yield f',\n  "{key}": {self.thumb_index}'
                continue

            if key == 'streams':
                yield ',\n  "streams": [\n'
                refs = [ref.to_json() for ref in self.streams]
                yield indent(',\n'.join(refs), 4)
                yield '\n  ]'
                continue
            
            if not getattr(self, key):
                continue

            if not first:
                yield ',\n  '
            else:
                first = False

            yield f'"{key}": {json_escape(getattr(self, key))}'

        yield '\n}'
    
    def __str__(self):
        return self.to_json()


class Games(list):
    def __init__(self, data):
        if type(data) is not list:
            raise TypeError

        ids = set()

        for game_raw in data:
            game = Game(**game_raw)

            if game.id in ids:
                raise ValueError(f'ID already taken: {game.id}')
            else:
                ids.add(game.id)

            self.append(game)

    @join()
    def to_json(self):
        yield '[\n'

        first = True
        for game in self:
            if not first:
                yield ',\n'
            else:
                first = False

            yield indent(game.to_json(), 2)

        yield '\n]'
    
    def __str__(self):
        return self.to_json()


games = Games(load_json('data/games.json'))
