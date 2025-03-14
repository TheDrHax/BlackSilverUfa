"""Usage: plot <stream>"""

import re

import plotly.graph_objects as go
from docopt import docopt

from ..data.loader.default import streams
from ..data.timecodes import Timecode
from ..utils.ass import SubtitlesReader
from .converter import unpack_line_breaks, unpack_emotes


STEP = 30


def pattern(emotes):
    return re.compile(f'({"|".join(emotes)})')


EMOTES = {
    'laugh': pattern([
        'OMEGALUL',
        'KEKW',
        'KEKYou',
        'KEKL',
        'KEKWLikeThis',
        'LUL',
        'LuL',
        'bufaLough',
        'bufaLUL',
        'OMEGAROLL',
        'KEKLEO',
        'ICANT'
    ]),
    'scare': pattern([
        'WutFace',
        'BSURage',
        'bufaUF',
        'bufaW',
        'bufaU',
        'monkaX',
        'monkaGunshake',
        'monkaChrist',
        'monkaS',
        'monkaW',
        'peepoSHAKE',
        'monkaBehind',
        'monkaEyes',
        'Wut',
        'WutFaceW'
    ]),
    'dance': pattern([
        'BBoomer',
        'blobDance',
        'BSUDance',
        'BSUFlex',
        'BSUJam',
        'ChickenRave',
        'duckDance',
        'Libido',
        'Jammies',
        'peepoJAMMER',
        'peepoDJ',
        'peepoSnow',
        'pirateD',
        'TaBeRu',
        'VIBE',
        'kiryuJAM'
    ]),
    'cry': pattern([
        'BibleThump',
        'CatCrying',
        'bufaThump',
        'bufaSad' 
    ]),
    'будь': re.compile('будь здоров', re.I),
    'cat': pattern([
        '[Тт]ося',
        'BLELELE',
        'bufaLove',
        'bufaLewd',
        'CatEyes',
        'PETTHECAT'
    ]),
    'dog': pattern([
        '[Ээ]+ван',
        'BegWan',
        'PETTHEEVAN'
    ]),
    'F': re.compile('(^|\\s)(f|NotLikeThis)(\\s|$)', re.I),
    'story': pattern([
        'CoolStoryBob',
        'bufaCoolStory',
        'PixelBob'
    ]),
    'pog': pattern([
        'Pog',
        'bufaBobchan',
        'bufaPogU',
        'bufaPog',
        'VisLaud',
        'PogChamp'
    ])
}


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    r = SubtitlesReader(streams[args['<stream>']][0].subtitles_path)

    data = dict((k, []) for k in EMOTES)

    for event in r.events():
        text = unpack_line_breaks(event.text)
        text = unpack_emotes(text)

        start = int(event.start // STEP)

        for category, pattern in EMOTES.items():
            for _ in range(start - len(data[category]) + 1):
                data[category].append(0)

            data[category][start] += len(pattern.findall(text))

    r.close()

    x = [str(Timecode(x * STEP))
         for x in range(len(list(data.values())[0]))]

    fig = go.Figure()

    for category in EMOTES:
        fig.add_trace(go.Scatter(name=category, x=x, y=data[category]))

    fig.show()


if __name__ == '__main__':
    main()
