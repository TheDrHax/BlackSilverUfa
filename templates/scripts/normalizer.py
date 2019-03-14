#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
This script attempts to normalize JSON data files.

Currently supported files:
* data/timecodes.json (sort and format)
"""

import json

from ..utils import load_json
from ..data.timecodes import Timecodes


def normalize_timecodes(filename='data/timecodes.json'):
    data = load_json(filename)
    keys = sorted(data.keys())
    result = {}

    for key in keys:
        result[key] = Timecodes(data[key]).to_dict()

    with open(filename, 'w') as fo:
        json.dump(result, fo, indent=2, ensure_ascii=False)


if __name__ == '__main__':
    normalize_timecodes()
