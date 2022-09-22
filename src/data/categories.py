import attr
from typing import Union
from sortedcontainers import SortedList

from ..utils import join, json_escape


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

        yield '\n}'
