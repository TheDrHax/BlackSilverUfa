#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from .utils import load_json, AttrDict


class Stream(AttrDict):
    pass


class SegmentedStream(list):
    pass


class Streams(AttrDict):
    def __init__(self, data):
        if type(data) is not dict:
            raise TypeError

        for id, stream in data.items():
            if type(stream) is dict:
                self[id] = Stream(stream)
            elif type(stream) is list:
                self[id] = SegmentedStream(stream)
            else:
                raise TypeError


class Game(AttrDict):
    pass


class Games(list):
    def __init__(self, data):
        if type(data) is not list:
            raise TypeError

        for game in data:
            self.append(Game(game))

    def update_streams(self, streams):
        for game in self:
            for stream in game['streams']:
                stream_info = streams[stream['twitch']]
                if type(stream_info) is Stream:
                    stream.update(stream_info)
                elif type(stream_info) is SegmentedStream:
                    stream.update(stream_info[stream['segment']])


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
