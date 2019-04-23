#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from datetime import datetime

from .streams import streams, SegmentReference
from ..utils import load_json


class Game:
    def __init__(self, data):
        if type(data) is not dict:
            raise TypeError(type(data))

        self.name = data['name']
        self.category = data['category']
        self.type = data.get('type') or None
        self.id = data['id']
        self.streams = []
        self.thumb_index = data.get('thumbnail') or 0

        for segment in data['streams']:
            ref = SegmentReference(stream=streams[segment['twitch']],
                                   data=segment, game=self)
            ref._segment.references.add(ref)
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
        streams = self.streams
        return sum(s.stream._unix_time for s in streams) // len(streams)

    @property
    def date(self):
        return datetime.fromtimestamp(self._unix_time)


class Games(list):
    def __init__(self, data):
        if type(data) is not list:
            raise TypeError

        ids = set()

        for game_raw in data:
            game = Game(game_raw)

            if game.id in ids:
                raise ValueError(f'ID already taken: {game.id}')
            else:
                ids.add(game.id)

            self.append(game)


games = Games(load_json('data/games.json'))
