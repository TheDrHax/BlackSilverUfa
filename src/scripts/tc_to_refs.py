"""Usage: tc_to_games <stream>"""

import re

from docopt import docopt
from typing import Dict

from ..data.timecodes import Timecode, Timecodes
from ..data.games import Game
from ..data.streams import Segment, SegmentReference
from ..data.loader.default import timecodes, games, streams
from ..data.loader.games import normalize_game_name


GROUPS = {
    '':         'first-2025',
    'пройдено': 'single-2025'
}


def get_chapters(tc: Timecodes) -> Timecodes:
    res = Timecodes()

    for t in tc:
        if isinstance(t, Timecodes):
            res.add(t)
    
    return res


def game_by_id(id: str) -> Game:
    return [game for game in games if game.id == id][0]


def sort_chapters(chapters: Timecodes) -> Dict[str, Timecodes]:
    res = dict()

    for c in chapters:
        parts = c.name.split(' - ')

        if len(parts) > 1:
            group = parts[-1]
            name = ' - '.join(parts[0:-1])
            c.name = name
        else:
            group = ''
            name = c.name

        if group in GROUPS:
            game = GROUPS[group]
        else:
            print(f'Ignoring {name} (unknown group)')
            continue

        nname = normalize_game_name(name)
        if nname in games.names:
            print(f'Ignoring {name} (already exists)')
            continue

        if game not in res:
            res[game] = Timecodes()
        
        res[game].add(Timecode(start=c.start, name=name))

    return res


def create_refs(segment: Segment, ref_map: Dict[str, Timecodes]):
    for game_id, refs_list in ref_map.items():
        game = game_by_id(game_id)
        subrefs = [dict(name=t.name, start=t.start) for t in refs_list]

        ref = SegmentReference(game=game, parent=segment, subrefs=subrefs)
        game.streams.append(ref)


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    stream_id = args['<stream>']
    stream = streams[stream_id]
    segment = stream[0]

    tc = timecodes[stream_id]
    chapters = get_chapters(tc)
    ref_map = sort_chapters(chapters)

    create_refs(segment, ref_map)
    games.save()
    timecodes.save()


if __name__ == '__main__':
    main()
