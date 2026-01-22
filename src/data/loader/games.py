from typing import Dict, List, Union

from ...utils import load_json, join, indent
from ..games import Game
from ..streams import SegmentReference, SubReference
from .streams import Streams


def normalize_game_name(name: str) -> str:
    return name.lower().split(' (демо')[0]


class Games(List[Game]):
    def track_game(self, game: Union[Game,SubReference]):
        nname = normalize_game_name(game.name)

        if nname in self.names:
            print(f'WARN: Duplicate subref names: "{game.name}"')
        else:
            self.names[nname] = game

    def _parse_game(self, streams: Streams, game_raw):
        game_id = game_raw['id']
        if game_id in self.ids:
            raise ValueError(f'ID already taken: {game_id}')
        else:
            self.ids.add(game_id)

        refs_raw = game_raw.pop('streams')
        game = Game(**game_raw)

        self.track_game(game)

        segments = set()

        for ref in refs_raw:
            parent = streams[ref.pop('twitch')][ref.pop('segment', 0)]

            if parent in segments:
                raise ValueError(f'Duplicate refs {parent.hash} in {game_id}')

            segments.add(parent)

            ref = SegmentReference(parent=parent, game=game, **ref)
            ref.stream.games.append((game, ref))
            game.streams.append(ref)

            if game.type == 'list':
                for subref in ref.subrefs:
                    if not subref.hidden:
                        self.track_game(subref)

        self.append(game)

    def __init__(self, streams: Union[Streams, None] = None,
                 filename: Union[str, None] = None):
        self.filename = filename
        self.names = dict()
        self.ids = set()

        if not streams or not filename:
            return

        data: List[Dict] = load_json(filename)

        for game_raw in data:
            self._parse_game(streams, game_raw)

    @join()
    def to_json(self, compiled: bool = False):
        yield '[\n'

        first = True
        for game in self:
            if compiled and len(game.streams) == 0:
                continue

            if not first:
                yield ',\n'
            else:
                first = False

            yield indent(game.to_json(compiled), 2)

        yield '\n]'

    def __str__(self):
        return self.to_json()

    def save(self, filename: Union[str, None] = None, compiled: bool = False):
        if filename is None:
            if self.filename is None:
                raise ValueError

            filename = self.filename

        data = self.to_json(compiled)

        with open(filename, 'w') as fo:
            fo.write(data)
            fo.write('\n')
