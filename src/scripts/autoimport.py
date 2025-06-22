"""Usage: autoimport [--dry-run] [--no-refs] [<vod>]"""

import os
import json
import requests

from itertools import chain
from datetime import datetime
from docopt import docopt
from typing import Union
from twitch_utils.clip import Clip
from twitch_utils.offset import find_offset

from .source_cuts import get_source_cuts
from ..data.fallback import fallback
from ..data.streams import SegmentReference, Stream
from ..data.games import Game
from ..data.timecodes import T, Timecode, Timecodes
from ..data.loader.default import streams, games, timecodes


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


def find_intro(vod: str) -> Union[Timecode, None]:
    clip_vod = Clip(os.path.join(fallback.directory, f'{vod}.mp4'))
    clip_intro = Clip(os.path.join('sounds', 'intro.wav'))
    offset, score = find_offset(clip_intro, clip_vod, end=600, min_score=10, ar=500)

    if score > 0:
        return Timecode(round(offset), name='Интро')


def create_timecodes(vod: str, timeline: Timecodes) -> None:
    ts = Timecodes()

    for x in timeline:
        t = Timecodes(name=x.name)
        t.add(Timecode(x, name='Меню'))

        i = 2
        while t in ts:
            t.name = f'{x.name} ({i})'
            i += 1

        ts.add(t)

    try:
        t_intro = find_intro(vod)
        if t_intro:
            ts.add(t_intro)
    except Exception as ex:
        print(f'Unable to find intro: {ex}')

    ts = ts.filter(lambda t: t > 0)

    print('Adding timecodes:')
    print(json.dumps(ts.to_dict(), ensure_ascii=False, indent=2))
    timecodes[vod] = ts


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

    assert vod not in streams or args['--dry-run']

    if not vod:
        info = requests.get('https://red.drhx.ru/blackufa/twitch').json()
        vod = info['vod']
        assert vod is not None
    else:
        info = requests.get(f'https://red.drhx.ru/blackufa/twitch/{vod}').json()

    timeline = get_timeline(info['game_history'])

    stream = create_stream(vod)

    try:
        source_cuts = get_source_cuts(
            [os.path.join(fallback.directory, f'{vod}.mp4')],
            os.path.join(fallback.directory, f'{vod}.log')
        )

        if len(source_cuts) > 0:
            print(f'Adding source_cuts: {source_cuts.to_list()}')
            stream.cuts = source_cuts
    except Exception as ex:
        print(f'Unable to find source_cuts: {ex}')

    create_timecodes(vod, timeline)

    if not args['--no-refs']:
        def normalize_game(name: str) -> str:
            return name.lower().split(' (')[0]

        all_games = dict((normalize_game(g.name), g)
                         for g in games
                         if g.type != 'list')

        subrefs = []

        for t in timeline:
            existing_game = all_games.get(normalize_game(t.name))

            if existing_game:
                prev_ref_name = normalize_game(existing_game.streams[-1].name)
                if prev_ref_name.isnumeric():
                    name = str(int(prev_ref_name) + 1)
                else:
                    name = '?'

                ref = SegmentReference(game=existing_game,
                                       parent=stream[0],
                                       name=name,
                                       start=t.start)

                existing_game.streams.append(ref)
                print(f'Adding segment reference into "{existing_game.id}":')
                print(ref.to_json())
                continue

            subrefs.append(dict(name=t.name, start=t.start))

        if len(subrefs) > 0:
            game = create_game(name='Не размечено', id='todo')

            for subref in subrefs:
                subref['name'] = next_name(game, subref['name'])

            ref = SegmentReference(game=game, parent=stream[0], subrefs=subrefs)
            game.streams.append(ref)
            print(f'Adding segment reference into "{game.id}":')
            print(ref.to_json())

    if not args['--dry-run']:
        print('Saving changes')
        streams.save()
        games.save()
        timecodes.save()


if __name__ == '__main__':
    main()
