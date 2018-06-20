#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from .streams import Segment


class SegmentReference(Segment):
    def __init__(self, streams, ref):
        self.parent = {}
        super(SegmentReference, self).__init__(ref)
        self.parent = streams[self['twitch']][self['segment']]

    def __len__(self):
        return super(SegmentReference, self).__len__() + self.parent.__len__()

    def __iter__(self):
        raise NotImplemented

    def __contains__(self, key):
        if super(SegmentReference, self).__contains__(key):
            return True
        return self.parent.__contains__(key)

    def __getitem__(self, key):
        if super(SegmentReference, self).__contains__(key):
            return super(SegmentReference, self).__getitem__(key)
        return self.parent.__getitem__(key)

    def get(self, key):
        try:
            return self.__getitem__(key)
        except KeyError:
            return None

    def keys(self):
        keys = set()
        [keys.add(key) for key in super(SegmentReference, self).keys()]
        [keys.add(key) for key in self.parent.keys()]
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
        for stream in game['streams']:
            self['streams'].append(SegmentReference(streams, stream))


class Games(list):
    def __init__(self, streams, data):
        if type(data) is not list:
            raise TypeError

        for game in data:
            self.append(Game(streams, game))
