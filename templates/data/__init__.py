#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from .utils import load_json, AttrDict


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


class Category(AttrDict):
    pass


class Categories(list):
    def __init__(self, data):
        if type(data) is not list:
            raise TypeError

        for category in data:
            self.append(Category(category))

    def add_games(self, games):
        for category in self:
            category['games'] = []
            for game in games:
                if category['code'] == game['category']:
                    category['games'].append(game)


streams = Streams(load_json("data/streams.json"))
games = Games(load_json("data/games.json"))
games.update_streams(streams)
categories = Categories(load_json("data/categories.json"))
categories.add_games(games)
