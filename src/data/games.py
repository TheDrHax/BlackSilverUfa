from typing import Union, List
import attr
from cached_property import cached_property

from .streams import SegmentReference
from .blacklist import Blacklist, blacklist
from ..utils import join, json_escape, indent


@attr.s(auto_attribs=True)
class Game:
    name: str = attr.ib()
    category: str = attr.ib()
    id: str = attr.ib()
    type: Union[str, None] = None
    cover: int = 0
    streams: List[SegmentReference] = attr.ib(factory=list)
    _blacklist: Blacklist = attr.ib({}, converter=lambda x: Blacklist(**x))

    @cached_property
    def blacklist(self):
        return blacklist + self._blacklist

    @property
    def date(self):
        return self.streams[self.cover].stream.date

    @join()
    def to_json(self, compiled: bool = False):
        if compiled:
            keys = ['name', 'category', 'type', 'id', 'streams', 'cover']
        else:
            keys = ['name', 'category', 'type', 'id',
                    'streams', 'cover', '_blacklist']

        yield '{\n  '

        first = True
        for key in keys:
            if key == 'cover' and self.cover == 0:
                continue

            if key == 'streams':
                yield ',\n  "streams": [\n'
                refs = [ref.to_json(compiled) for ref in self.streams]
                yield indent(',\n'.join(refs), 4)
                yield '\n  ]'
                continue

            if key == '_blacklist':
                if len(self._blacklist) == 0:
                    continue

                yield ',\n  "blacklist": '
                yield indent(self._blacklist.to_json(), 2)[2:]
                continue

            value = getattr(self, key)

            if not value:
                continue

            if not first:
                yield ',\n  '
            else:
                first = False

            yield f'"{key}": {json_escape(value)}'

        yield '\n}'

    def __str__(self):
        return self.to_json()
