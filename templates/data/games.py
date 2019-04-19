#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from datetime import datetime
from .streams import Segment


class SegmentReference(Segment):
    def __init__(self, streams, ref):
        self.segment = {}
        super(SegmentReference, self).__init__(ref)
        self.segment = streams[self['twitch']][self['segment']]
        self.stream = self.segment.stream
        self.segment.references.add(self)
        
        # if 'start' in self and self['start'] not in self.stream.timecodes:
        #     raise ValueError('Wrong "start" value: '
        #                      f'Timecode {str(self["start"])} is not '
        #                      f'in stream {self["twitch"]}')

    def __len__(self):
        return super(SegmentReference, self).__len__() + self.segment.__len__()

    def __iter__(self):
        raise NotImplemented

    def __contains__(self, key):
        if super(SegmentReference, self).__contains__(key):
            return True
        return self.segment.__contains__(key)

    def __getitem__(self, key):
        if super(SegmentReference, self).__contains__(key):
            return super(SegmentReference, self).__getitem__(key)
        return self.segment.__getitem__(key)

    def get(self, key):
        try:
            return self.__getitem__(key)
        except KeyError:
            return None

    def keys(self):
        keys = set()
        [keys.add(key) for key in super(SegmentReference, self).keys()]
        [keys.add(key) for key in self.segment.keys()]
        return keys


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
        return len(set([s['twitch'] for s in self['streams']]))

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
