#!/usr/bin/env python3
# -*- coding: utf-8 -*-


class Category(dict):
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
