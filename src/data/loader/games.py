from typing import Dict, List, Union
from itertools import groupby

from ...utils import load_json, join, indent
from ..games import Game
from ..streams import Segment, SegmentReference, SubReference
from ..timecodes import Timecode
from .streams import Streams


def normalize_game_name(name: str) -> str:
    return name.lower().split(' (демо')[0]


class Games(List[Game]):
    def track_name(self, name):
        nname = normalize_game_name(name)

        if nname in self.names:
            print(f'WARN: Duplicate subref names: "{name}"')
        else:
            self.names.add(nname)

    def _parse_game(self, streams: Streams, game_raw):
        game_id = game_raw['id']
        if game_id in self.ids:
            raise ValueError(f'ID already taken: {game_id}')
        else:
            self.ids.add(game_id)

        refs_raw = game_raw.pop('streams')
        game = Game(**game_raw)

        self.track_name(game.name)

        segments = set()

        for ref in refs_raw:
            parent = streams[ref.pop('twitch')][ref.pop('segment', 0)]

            if 'subrefs' not in ref:
                subrefs = [{'name': ref.pop('name'),
                            'start': ref.pop('start', 0),
                            'blacklist': ref.pop('blacklist', {})}]
            else:
                subrefs = ref.pop('subrefs')

            if parent.stream.joined:
                start = Timecode(subrefs[0].get('start', 0))

                orig = parent.stream
                new_parent = parent.stream.joined[0]
                base_offset = new_parent.offsets[0]

                offset = new_parent.offsets[new_parent.stream.streams.index(orig)]
                offset -= base_offset
                offset = offset.start

                if not parent.playable or start >= -base_offset:
                    parent = new_parent

                    for subref in subrefs:
                        subref['start'] = str(Timecode(subref.get('start', 0) + offset))

            if parent in segments:
                raise ValueError(f'Duplicate refs {parent.hash} in {game_id}')

            segments.add(parent)

            if len(subrefs) > 1:
                ref = SegmentReference(parent=parent, game=game, subrefs=subrefs, **ref)
            else:
                ref = SegmentReference(parent=parent, game=game, **ref, **subrefs[0])

            ref.stream.games.append((game, ref))
            game.streams.append(ref)

            if game.type == 'list':
                [self.track_name(subref.name) for subref in ref.subrefs]

        self.append(game)

    def __init__(self, streams: Union[Streams, None] = None,
                 filename: Union[str, None] = None):
        self.filename = filename
        self.names = set()
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
