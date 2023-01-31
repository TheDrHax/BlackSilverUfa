from datetime import datetime, timedelta
from typing import Dict, Union

from ...utils import load_json, join
from ..categories import Category
from .games import Games


class Categories(Dict[str, Category]):
    def __init__(self, games: Union[Games, None] = None,
                 filename: Union[str, None] = None):
        self.filename = filename

        if not games or not filename:
            return

        categories = load_json(filename)

        if type(categories) is not list:
            raise TypeError

        uncategorized = games.copy()

        for category in categories:
            c = Category.from_dict(category, games=uncategorized)
            self[c.code] = c

        month_ago = datetime.now() - timedelta(days=90)

        if 'ongoing' in self and 'abandoned' in self:
            for game in self['ongoing'].games.copy():
                if game.streams[-1].date < month_ago:
                    self['ongoing'].games.remove(game)
                    self['abandoned'].games.add(game)
                    game.category = 'abandoned'

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

    def save(self, filename: Union[str, None] = None, compiled=False):
        if filename is None:
            if self.filename is None:
                raise ValueError

            filename = self.filename

        data = self.to_json(compiled)

        with open(filename, 'w') as fo:
            fo.write(data)
            fo.write('\n')
