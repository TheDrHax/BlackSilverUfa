import attr
from datetime import datetime

from .streams import streams, SegmentReference
from ..utils import load_json, join, json_escape, indent


GAMES_JSON = 'data/games.json'


@attr.s(auto_attribs=True)
class Game:
    name: str = attr.ib()
    category: str = attr.ib()
    id: str = attr.ib()
    type: str = None
    cover: int = 0
    streams: list = attr.ib(factory=list)

    def __attrs_post_init__(self):
        refs = []

        for segment in self.streams:
            parent = streams[segment['twitch']][segment.get('segment') or 0]

            del segment['twitch']
            if 'segment' in segment:
                del segment['segment']

            ref = SegmentReference(parent=parent, game=self, **segment)
            ref.stream.games.append((self, ref))
            refs.append(ref)

        self.streams = refs

    @property
    def stream_count(self):
        return len(set([s.twitch for s in self.streams]))

    @property
    def thumbnail(self):
        if isinstance(self.cover, int):
            return self.streams[self.cover].thumbnail
        else:
            return self.cover

    @property
    def filename(self):
        return f'/links/{self.id}.html'

    @property
    def _unix_time(self):
        return self.streams[self.cover].stream._unix_time

    @property
    def date(self):
        return datetime.fromtimestamp(self._unix_time)

    @join()
    def to_json(self):
        keys = ['name', 'category', 'type', 'id', 'streams', 'cover']

        yield '{\n  '

        first = True
        for key in keys:
            if key == 'cover' and self.cover == 0:
                continue

            if key == 'streams':
                yield ',\n  "streams": [\n'
                refs = [ref.to_json() for ref in self.streams]
                yield indent(',\n'.join(refs), 4)
                yield '\n  ]'
                continue

            if not getattr(self, key):
                continue

            if not first:
                yield ',\n  '
            else:
                first = False

            yield f'"{key}": {json_escape(getattr(self, key))}'

        yield '\n}'

    def __str__(self):
        return self.to_json()


class Games(list):
    def __init__(self, filename: str = GAMES_JSON):
        self.filename = filename
        data = load_json(filename)

        ids = set()
        for game_raw in data:
            game = Game(**game_raw)

            if game.id in ids:
                raise ValueError(f'ID already taken: {game.id}')
            else:
                ids.add(game.id)

            self.append(game)

    @join()
    def to_json(self) -> str:
        yield '[\n'

        first = True
        for game in self:
            if not first:
                yield ',\n'
            else:
                first = False

            yield indent(game.to_json(), 2)

        yield '\n]'

    def __str__(self):
        return self.to_json()

    def save(self, filename: str = None):
        if filename is None:
            filename = self.filename

        data = self.to_json()

        with open(filename, 'w') as fo:
            fo.write(data)
            fo.write('\n')


games = Games()
