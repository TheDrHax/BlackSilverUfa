"""Usage: autoimport [--dry-run] <vod>"""

import sys
import requests

from itertools import chain
from datetime import datetime
from docopt import docopt

from ..data.streams import SegmentReference, Stream, streams
from ..data.games import Game, games
from ..data.timecodes import T, Timecode, Timecodes, timecodes


SKIP_LIST = [
    'Just Chatting'
]


def parse_date(d: str) -> datetime:
    return datetime.fromisoformat(d.rstrip('Z'))


def date_delta(d1: datetime, d2: datetime) -> Timecode:
    return T + (d2 - d1).seconds


def get_timeline(game_history) -> Timecodes:
    start = parse_date(game_history[0]['date'])
    result = Timecodes()

    for game in game_history:
        t = date_delta(start, parse_date(game['date'])) - 60
        t.name = game['name']

        if t < 0:
            t.start = T + 0
            t.duration = T + 0

        if t.name in SKIP_LIST:
            continue

        if len(result) > 0 and result[-1].name == t.name:
            continue

        result.add(t)

    return result


def create_stream(key: str) -> Stream:
    print(f'Adding stream: {key}')
    stream = Stream(key=key, data=[{}])
    streams[key] = stream
    return stream


def create_game(name, id, category='other', type=None) -> Game:
    try:
        return next(x for x in games if x.id == id)
    except StopIteration:
        print(f'Adding game "{name}" ({id})')

        game = Game(name=name, id=id, category=category, type=type)
        games.append(game)
        return game


def create_timecodes(vod: str, timeline: Timecodes) -> None:
    ts = Timecodes()
    for x in timeline:
        t = Timecodes(name=x.name)
        t.add(Timecode(x, name='Начало'))

        i = 2
        while t in ts:
            t.name = f'{x.name} ({i})'
            i += 1

        ts.add(t)

    timecodes[vod] = ts.filter(lambda t: t > 0)

    print('Adding timecodes:')
    print(timecodes[vod])


def next_name(game: Game, name: str) -> str:
    i = 1

    for subref in chain(*[ref.subrefs for ref in game.streams]):
        new_name = f'{name} #{i}'

        if subref.name == name:
            print(f'Renaming subref of {subref.parent.hash} "{subref.name}" '
                  f'→ "{new_name}"')
            subref.name = new_name
            i += 1
        elif subref.name == new_name:
            i += 1

    if i == 1:
        return name

    return f'{name} #{i}'


def main(argv=None):
    args = docopt(__doc__, argv=argv)
    vod = args['<vod>']

    if vod in streams:
        print(f'Stream "{vod}" already exists')
        sys.exit(1)

    info = requests.get(f'https://red.thedrhax.pw/blackufa/twitch/{vod}').json()
    timeline = get_timeline(info['game_history'])

    stream = create_stream(vod)
    create_timecodes(vod, timeline)
    game = create_game(name='Не размечено', id='todo')

    ref = SegmentReference(game=game,
                           parent=stream[0],
                           subrefs=[{'name': next_name(game, t.name),
                                     'start': t.start}
                                    for t in timeline])

    game.streams.append(ref)

    print('Adding segment reference:')
    print(ref.to_json())

    if not args['--dry-run']:
        print('Saving changes')
        streams.save()
        games.save()
        timecodes.save()


if __name__ == '__main__':
    main()
