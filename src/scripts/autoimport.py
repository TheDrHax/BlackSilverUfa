"""Usage: autoimport [--dry-run] <vod>"""

import sys
import requests

from datetime import datetime
from docopt import docopt

from ..data.streams import SegmentReference, Stream, SubReference, streams
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


def main(argv=None):
    args = docopt(__doc__, argv=argv)
    vod = args['<vod>']

    if vod in streams:
        print(f'Stream "{vod}" already exists')
        sys.exit(1)

    info = requests.get(f'https://red.thedrhax.pw/blackufa/twitch/{vod}').json()
    timeline = get_timeline(info['game_history'])

    print(f'Adding stream: {vod}')
    stream = Stream(key=vod, data=[{}])
    streams[vod] = stream

    try:
        game = next(x for x in games if x.id == 'todo')
    except StopIteration:
        print('Adding game "Не размечено (todo)"')
        game = Game(name='Не размечено', id='todo',
                    category='other', type='list')
        games.append(game)

    ref = SegmentReference(game=game, parent=stream[0],
                           name=timeline[0].name)

    for t in timeline[1:]:
        SubReference(name=t.name, start=t.start, parent=ref)

    game.streams.append(ref)

    print('Adding segment reference:')
    print(ref.to_json())

    ts = Timecodes()
    for x in timeline:
        t = Timecodes(name=x.name)
        t.add(Timecode(x, name='Начало'))

        i = 2
        while t in ts:
            t.name = f'{x.name} ({i})'
            i += 1

        ts.add(t)

    timecodes[vod] = ts.filter(lambda t: t > 0).to_dict()

    print('Adding timecodes:')
    print(timecodes[vod])

    if not args['--dry-run']:
        print('Saving changes')
        streams.save()
        games.save()
        timecodes.save()


if __name__ == '__main__':
    main()
