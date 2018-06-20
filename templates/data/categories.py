#!/usr/bin/env python3
# -*- coding: utf-8 -*-


class Category(dict):
    def __init__(self, games, category):
        super(Category, self).__init__(category)

        self['games'] = []
        for game in games:
            if self['code'] == game['category']:
                self['games'].append(game)


class Categories(list):
    def __init__(self, games, data):
        if type(data) is not list:
            raise TypeError

        for category in data:
            self.append(Category(games, category))
