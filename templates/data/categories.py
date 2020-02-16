#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from datetime import datetime, timedelta
from sortedcontainers import SortedList

from .games import games
from .streams import streams
from ..utils import load_json


class Category:
    @staticmethod
    def from_dict(data, games=[]):
        self = Category(**data)

        for game in games.copy():
            if self.code == game.category:
                if not game.type:
                    self.games.add(game)
                elif game.type == 'list':
                    self.games.update(game.streams)

                games.remove(game)

        return self

    def __init__(self, **kwargs):
        def attr(key, default=None, func=lambda x: x):
            if key in kwargs:
                setattr(self, key, func(kwargs[key]))
            else:
                setattr(self, key, default)

        attr('search', True, bool)
        attr('split_by_year', True, bool)

        for key in ['name', 'code', 'description']:
            attr(key)

        attr('level', 2)

        self.games = SortedList(key=lambda x: x.date)


class Categories(dict):
    def __init__(self, data):
        if type(data) is not list:
            raise TypeError

        uncategorized = games.copy()

        for category in data:
            if category['code'] == 'recent':
                c = Category.from_dict(category)
                last_segments = list(streams.segments)[-10:]

                for segment in last_segments:
                    c.games.add(segment.reference())
            else:
                c = Category.from_dict(category, games=uncategorized)

            self[c.code] = c

        month_ago = datetime.now() - timedelta(days=30)
                
        if 'ongoing' in self and 'abandoned' in self:
            for game in self['ongoing'].games.copy():
                if game.streams[-1].date < month_ago:
                    self['ongoing'].games.remove(game)
                    self['abandoned'].games.add(game)

        if len(uncategorized) > 0:
            names = [f'{game.name} ({game.category})'
                     for game in uncategorized]
            raise(AttributeError('Invalid category in ' + ', '.join(names)))


categories = Categories(load_json('data/categories.json'))