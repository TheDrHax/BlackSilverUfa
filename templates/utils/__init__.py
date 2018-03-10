#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib

from .timecodes import Timecode


def player_compatible(stream):
    for i in ['youtube', 'vk', 'direct']:
        if i in stream:
            return True
    return False


def stream_hash(stream):
    hash = stream['twitch']

    if stream.get('segment'):
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
    return ' '.join(
        ['data-{}="{}"'.format(key, escape_attr(stream[key]))
         for key in stream.keys()
         if key not in ['note', 'timecodes']]
    )


def mpv_file(stream):
    if stream.get('youtube'):
        return 'ytdl://' + stream['youtube']
    elif stream.get('vk'):
        vk_link = 'https://api.thedrhax.pw/vk/video/{}\?redirect'
        return vk_link.format(stream['vk'])
    elif stream.get('direct'):
        return stream['direct']


def mpv_args(stream):
    result = '--sub-file=chats/v{}.ass '.format(stream['twitch'])
    if stream.get('offset'):
        result += '--sub-delay=-{} '.format(int(Timecode(stream['offset'])))
    return result.strip()


def count_format(i):
    if i == 1:
        return u'{0} стрим'.format(i)
    elif i in [2, 3, 4]:
        return u'{0} стрима'.format(i)
    else:
        return u'{0} стримов'.format(i)
