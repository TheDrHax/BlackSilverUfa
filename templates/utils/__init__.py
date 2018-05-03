#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import hashlib
from pymorphy2 import MorphAnalyzer
from .timecodes import Timecode


morph = MorphAnalyzer()


def load_json(filename):
    with open(filename, "r") as f:
        return json.load(f)


def player_compatible(stream):
    for i in ['youtube', 'vk', 'direct']:
        if i in stream:
            return True
    return False


def stream_hash(stream):
    hash = stream['twitch']

    if stream.get('segment') is not None:
        hash = hash + '.' + str(stream['segment'])

    return hash


def md5file(f_path, block_size=2**20):
    md5 = hashlib.md5()
    with open(f_path, 'rb') as f:
        while True:
            data = f.read(block_size)
            if not data:
                break
            md5.update(data)
    return md5.hexdigest()


def escape_attr(attr):
    if type(attr) is str:
        return attr.replace('"', '&quot;')
    else:
        return str(attr)


def stream_to_attrs(stream):
    attrs = ['data-{}="{}"'.format(key, escape_attr(stream[key]))
             for key in stream.keys()
             if key not in ['note', 'timecodes']]

    if not player_compatible(stream):
        attrs.append('style="display: none"')

    return ' '.join(attrs)


def mpv_file(stream):
    if stream.get('youtube'):
        return 'ytdl://' + stream['youtube']
    elif stream.get('vk'):
        vk_link = 'https://api.thedrhax.pw/vk/video/{}.mp4'
        return vk_link.format(stream['vk'])
    elif stream.get('direct'):
        return stream['direct']


def mpv_args(stream):
    sub_format = '--sub-file=https://blackufa.thedrhax.pw/chats/v{}.ass '
    result = sub_format.format(stream['twitch'])
    offset = Timecode(0)
    if stream.get('offset'):
        offset = Timecode(stream['offset'])
        result += '--sub-delay={} '.format(-int(offset))
    if stream.get('start'):
        result += '--start={} '.format(int(Timecode(stream['start']) - offset))
    if stream.get('end'):
        result += '--end={} '.format(int(Timecode(stream['end']) - offset))
    return result.strip()


def numword(num, word):
    p = morph.parse(word)[0]
    return '{} {}'.format(num, p.make_agree_with_number(num).word)
