from typing import Union
import attr
from datetime import datetime, timedelta
from sortedcontainers import SortedList

from .games import games, Game
from .streams import SegmentReference
from ..utils import load_json, join, json_escape, indent


CATEGORIES_JSON = 'data/categories.json'


@attr.s(auto_attribs=True)
class Category:
    name: str = attr.ib()
    code: str = attr.ib()
    level: int = attr.ib()
    description: Union[None, str] = None
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
                    if len(game.streams) > 0:
                        self.games.add(game)
                elif game.type == 'list':
                    self.games.update(game.streams)

                games.remove(game)

        return self

    @join()
    def to_json(self, compiled=False):
        if not compiled:
            keys = ['name', 'description', 'code',
                    'level', 'search', 'split_by_year']
        else:
            keys = ['name', 'level']

        fields = attr.fields_dict(type(self))

        yield '{\n'

        first = True
        for key in keys:
            value = getattr(self, key)

            if key in fields and fields[key].default == value:
                continue

            if not first:
                yield ',\n'
            else:
                first = False

            yield f'  "{key}": {json_escape(value)}'

        if compiled:
            yield ',\n  "games": [\n'

            first = True
            for game in self.games:
                if isinstance(game, Game):
                    data = [game.name,
                            [game.id, game.streams[game.cover].hash]]

                    if not first:
                        yield ',\n'
                    else:
                        first = False

                    yield f'{json_escape(data)}'
                elif isinstance(game, SegmentReference):
                    for subref in game.subrefs:
                        data = [subref.name,
                                [game.game.id, game.hash, int(subref.start)]]

                        if not first:
                            yield ',\n'
                        else:
                            first = False

                        yield f'{json_escape(data)}'

            yield '\n  ]'

        yield '\n}'


class Categories(dict):
    def __init__(self, filename=CATEGORIES_JSON):
        self.filename = filename
        categories = load_json(filename)

        if type(categories) is not list:
            raise TypeError

        uncategorized = games.copy()

        for category in categories:
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

    @join()
    def to_json(self, compiled=False):
        if not compiled:
            yield '['

            first = True
            for key, category in self.items():
                if not first:
                    yield ', '
                else:
                    first = False

                yield category.to_json()

            yield ']'
        else:
            yield '{\n'

            first = True
            for key, category in self.items():
                if not first:
                    yield ',\n'
                else:
                    first = False

                yield f'"{key}": {category.to_json(compiled)}'

            yield '\n}'

    def save(self, filename: str = None, compiled=False):
        if filename is None:
            filename = self.filename

        data = self.to_json(compiled)

        with open(filename, 'w') as fo:
            fo.write(data)
            fo.write('\n')


categories = Categories()
