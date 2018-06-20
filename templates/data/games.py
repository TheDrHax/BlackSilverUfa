#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from .streams import Segment


class SegmentReference(Segment):
    def __init__(self, streams, ref):
        self.segment = {}
        super(SegmentReference, self).__init__(ref)
        self.segment = streams[self['twitch']][self['segment']]
        self.stream = self.segment.stream

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
        super(Game, self).__init__()

        if type(game) is not dict:
            raise TypeError(type(game))

        self['name'] = game['name']
        self['category'] = game['category']
        self['filename'] = game['filename']
        self['streams'] = []
        for segment_reference in game['streams']:
            ref = SegmentReference(streams, segment_reference)
            ref.stream.games.append((self, ref))
            self['streams'].append(ref)


class Games(list):
    def __init__(self, streams, data):
        if type(data) is not list:
            raise TypeError

        for game in data:
            self.append(Game(streams, game))
