#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from .utils import AttrDict


class Segment(AttrDict):
    def __init__(self, segment, key=None):
        super(Segment, self).__init__(segment)

        if 'segment' not in self:
            self.segment = 0

        if 'twitch' not in self:
            if key:
                self.twitch = key
            else:
                raise AttributeError('Missing attribute "twitch"')


class Stream(list):
    def __init__(self, segments, key):
        if type(segments) is not list:
            raise TypeError(type(segments))

        self.twitch = key
        for segment in segments:
            self.append(Segment(segment, key))


class Streams(AttrDict):
    def _from_dict(self, streams):
        for id, stream in streams.items():
            if type(stream) is dict:
                self[id] = Stream([stream], id)
            elif type(stream) is list:
                self[id] = Stream(stream, id)
            else:
                raise TypeError

    def _from_list(self, streams):
        for stream in streams:
            id = stream['twitch']
            self[id] = Stream([stream], id)

    def __init__(self, streams):
        if type(streams) is dict:
            self._from_dict(streams)
        elif type(streams) is list:
            self._from_list(streams)
        else:
            raise TypeError(type(streams))
