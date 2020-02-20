import attr
from datetime import datetime, timedelta
from sortedcontainers import SortedList

from .games import games
from .streams import streams
from ..utils import load_json


CATEGORIES_JSON = 'data/categories.json'


@attr.s(auto_attribs=True)
class Category:
    name: str = None
    description: str = None
    code: str = None
    level: int = 2
    search: bool = True
    split_by_year: bool = True

    games: SortedList = attr.ib(init=False, repr=False)

    def __attrs_post_init__(self):
        self.games = SortedList(key=lambda x: x.date)

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


categories = Categories(load_json(CATEGORIES_JSON))
