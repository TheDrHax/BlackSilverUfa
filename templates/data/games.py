#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from .utils import AttrDict
from .streams import Segment


class Game(AttrDict):
    def __init__(self, game):
        super(Game, self).__init__()

        if type(game) is not dict:
            raise TypeError(type(game))

        self.name = game['name']
        self.category = game['category']
        self.filename = game['filename']

        self.streams = []
        for stream in game['streams']:
            self.streams.append(Segment(stream))

    def update_streams(self, streams):
        for segment in self.streams:
            segment.update(streams[segment.twitch][segment.segment])


class Games(list):
    def __init__(self, data):
        if type(data) is not list:
            raise TypeError

        for game in data:
            self.append(Game(game))

    def update_streams(self, streams):
        for game in self:
            game.update_streams(streams)
