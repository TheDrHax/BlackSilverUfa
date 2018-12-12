#!/usr/bin/env python3
# -*- coding: utf-8 -*-


class Category(dict):
    def __init__(self, games, category):
        super(Category, self).__init__(category)

        self['games'] = []
        for game in games.copy():
            if self['code'] == game['category']:
                if not game.get('type'):
                    self['games'].append(game)
                elif game['type'] == 'list':
                    self['games'].extend(game['streams'])

                games.remove(game)


class Categories(list):
    def __init__(self, games, data):
        if type(data) is not list:
            raise TypeError

        uncategorized = games.copy()

        for category in data:
            self.append(Category(uncategorized, category))

        if len(uncategorized) > 0:
            names = [f'{game["name"]} ({game["category"]})'
                     for game in uncategorized]
            raise(AttributeError('Invalid category in ' + ', '.join(names)))
