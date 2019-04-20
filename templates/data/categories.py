#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from sortedcontainers import SortedList


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
        def attr(key, default):
            setattr(self, key, kwargs.get(key, default))

        attr('name', None)
        attr('code', None)
        attr('level', 2)
        attr('description', None)
        attr('split_by_year', None)
        attr('search', None)

        self.games = SortedList(key=lambda x: x.date)


class Categories(list):
    def __init__(self, streams, games, data):
        if type(data) is not list:
            raise TypeError

        uncategorized = games.copy()

        for category in data:
            if category['code'] == 'recent':
                recent = Category.from_dict(category)
                last_segments = list(streams.segments)[-10:]

                for segment in last_segments:
                    recent.games.add(segment.reference())
                
                self.append(recent)
            else:
                self.append(Category.from_dict(category, games=uncategorized))

        if len(uncategorized) > 0:
            names = [f'{game.name} ({game.category})'
                     for game in uncategorized]
            raise(AttributeError('Invalid category in ' + ', '.join(names)))
