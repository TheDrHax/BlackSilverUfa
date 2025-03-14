"""Usage: tc_to_games <stream>"""

import re

from docopt import docopt
from typing import Dict, Union

from ..data.timecodes import Timecode, Timecodes
from ..data.games import Game
from ..data.streams import Segment, SegmentReference, SubReference
from ..data.loader.default import timecodes, games, streams
from ..data.loader.games import normalize_game_name


GROUPS = {
    '':         'first-2025',
    'пройдено': 'single-2025'
}

SKIP = [
    'трейлеры'
]


def get_chapters(tc: Timecodes) -> Timecodes:
    res = Timecodes()

    for t in tc:
        if isinstance(t, Timecodes):
            res.add(t)
    
    return res


def game_by_id(id: str) -> Union[Game, None]:
    try:
        return [game for game in games if game.id == id][0]
    except IndexError:
        return None


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

        nname = normalize_game_name(name)
        g = game_by_id(group)

        if nname in SKIP:
            print(f'Skipping "{name}" (blacklisted)')
            continue

        if g:
            game = group
        elif nname in games.names:
            g = games.names[nname]

            if isinstance(g, Game):
                game = g.id
            elif isinstance(g, SubReference):
                game = input(f'Enter new game ID for "{name}": ')

                if not game:
                    continue

                if group == 'пройдено':
                    cat = 'finished'
                else:
                    cat = 'ongoing'

                new_game = Game(name=name, id=game, category=cat, streams=[])
                games.append(new_game)

                ref = g.parent

                if len(ref.subrefs) == 1:
                    old_game = [game for game in games if ref in game.streams][0]
                    new_game.streams.append(old_game.streams.pop(old_game.streams.index(ref)))
                else:
                    ref.subrefs.pop(ref.subrefs.index(g))
                    new_ref = SegmentReference(game=new_game, parent=ref.parent,
                                               name=g.name, start=g.start)
                    new_game.streams.append(new_ref)
        elif group in GROUPS:
            game = GROUPS[group]
        else:
            print(f'Ignoring {name} (unknown group)')
            continue

        if game not in res:
            res[game] = Timecodes()

        res[game].add(Timecode(start=c.start, name=name))

    return res


def create_refs(segment: Segment, ref_map: Dict[str, Timecodes]):
    for game_id, refs_list in ref_map.items():
        game = game_by_id(game_id)

        if not game:
            continue

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
