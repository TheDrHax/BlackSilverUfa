#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import hashlib
from pymorphy2 import MorphAnalyzer


morph = MorphAnalyzer()
prefix = './_site' if 'PREFIX' not in os.environ else os.environ['PREFIX']


def _(fp):
    return prefix + '/' + fp


def load_json(filename):
    with open(filename, "r") as f:
        return json.load(f)


def md5file(f_path, block_size=2**20):
    md5 = hashlib.md5()
    with open(f_path, 'rb') as f:
        while True:
            data = f.read(block_size)
            if not data:
                break
            md5.update(data)
    return md5.hexdigest()


def numword(num, word):
    p = morph.parse(word)[0]
    return '{} {}'.format(num, p.make_agree_with_number(num).word)
