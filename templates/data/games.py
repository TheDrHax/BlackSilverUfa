#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from datetime import datetime
from .streams import Segment
from .timecodes import Timecode


class SegmentReference(Segment):
    def __init__(self, streams, data):
        self._segment = streams[data['twitch']][data.get('segment') or 0]
        self.stream = self._segment.stream

        self.name = data['name']

        if 'note' in data:
            self.note = data['note']

        for key in ['start', 'end', 'offset']:
            if key in data:
                self.__setattr__(key, Timecode(data[key]))

        self._segment.references.add(self)

    def __getattr__(self, attr):
        return getattr(self._segment, attr)


class Game(dict):
    def __init__(self, streams, game):
        if type(game) is not dict:
            raise TypeError(type(game))

        super(Game, self).__init__(game)

        segments = self['streams']
        self['streams'] = []
        for segment_reference in segments:
            ref = SegmentReference(streams, segment_reference)
            ref.game = self
            ref.stream.games.append((self, ref))
            self['streams'].append(ref)

        if 'thumbnail' not in self:
            self['thumbnail'] = 0

    def stream_count(self):
        return len(set([s.twitch for s in self['streams']]))

    def thumbnail(self):
        return self['streams'][self['thumbnail']].thumbnail()
    
    @property
    def filename(self):
        return f'/links/{self["id"]}.html'

    @property
    def _unix_time(self):
        time, count = 0, 0
        for ref in self['streams']:
            time += ref.stream._unix_time
            count += 1
        return time // count

    @property
    def date(self):
        return datetime.fromtimestamp(self._unix_time)


class Games(list):
    def __init__(self, streams, data):
        if type(data) is not list:
            raise TypeError

        ids = set()

        for game_raw in data:
            game = Game(streams, game_raw)

            if game['id'] in ids:
                raise ValueError(f'ID already taken: {game["id"]}')
            else:
                ids.add(game['id'])

            self.append(game)
