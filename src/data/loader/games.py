from typing import List, Union

from ...utils import load_json, join, indent
from ..games import Game
from ..streams import SegmentReference
from .streams import Streams


def normalize_game_name(name: str) -> str:
    return name.lower().split(' (демо')[0]


class Games(List[Game]):
    def __init__(self, streams: Union[Streams, None] = None,
                 filename: Union[str, None] = None):
        self.filename = filename

        if not streams or not filename:
            return

        data = load_json(filename)

        ids = set()
        names = set()

        def track_name(name):
            nname = normalize_game_name(name)

            if nname in names:
                print(f'WARN: Duplicate subref names: "{name}"')
            else:
                names.add(nname)

        for game_raw in data:
            refs_raw = game_raw['streams']
            del game_raw['streams']

            game_id = game_raw['id']
            if game_id in ids:
                raise ValueError(f'ID already taken: {game_id}')
            else:
                ids.add(game_id)

            game = Game(**game_raw)

            track_name(game.name)

            for ref in refs_raw:
                parent = streams[ref['twitch']][ref.get('segment') or 0]

                del ref['twitch']
                if 'segment' in ref:
                    del ref['segment']

                ref = SegmentReference(parent=parent, game=game, **ref)
                ref.stream.games.append((game, ref))
                game.streams.append(ref)

                if game.type == 'list':
                    [track_name(subref.name) for subref in ref.subrefs]

            self.append(game)

    @join()
    def to_json(self, compiled: bool = False):
        yield '[\n'

        first = True
        for game in self:
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
