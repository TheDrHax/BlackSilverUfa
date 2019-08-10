#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
This script attempts to normalize JSON data files.

Currently supported files:
* data/timecodes.json (sort and format)
* data/games.json (format)
* data/streams.json (format)
"""

import json

from ..data.games import games
from ..data.streams import streams
from ..data.timecodes import Timecodes, timecodes


def normalize_timecodes(output='data/timecodes.json'):
    keys = sorted(timecodes.keys())
    result = {}

    for key in keys:
        result[key] = Timecodes(timecodes[key]).to_dict()

    with open(output, 'w') as fo:
        json.dump(result, fo, indent=2, ensure_ascii=False)
        fo.write('\n')


def normalize_games(output='data/games.json'):
    with open(output, 'w') as fo:
        fo.write(games.to_json())
        fo.write('\n')


def normalize_streams(output='data/streams.json'):
    with open(output, 'w') as fo:
        fo.write(streams.to_json())
        fo.write('\n')


if __name__ == '__main__':
    normalize_timecodes()
    normalize_games()
    normalize_streams()
