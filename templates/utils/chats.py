#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import tcd
import requests

from . import _, load_json
from ..data.fallback import FallbackSource
from ..data import config, streams


tcd_config = load_json('data/tcd.json')
fallback = FallbackSource(**config['fallback'])


def download(key, dest):
    if fallback.chats and f'{key}.ass' in fallback:
        url = fallback.url(f'{key}.ass')

        print(f'Downloading chat {key} via fallback source')

        try:
            r = requests.get(url)
            with open(dest, 'wb') as of:
                for chunk in r.iter_content(chunk_size=1024):
                    of.write(chunk)
            return
        except Exception as ex:
            print(ex)
            os.unlink(dest)

    print(f'Downloading chat {key} via TCD')
    tcd_config['directory'] = '/'.join(dest.split('/')[:-1])
    tcd.settings.update(tcd_config)

    try:
        tcd.download(key)
    except Exception as ex:
        print(ex)
        os.unlink(dest)


if __name__ == '__main__':
    # Create destination directory
    for dp in [_(''), _('chats')]:
        if not os.path.isdir(dp):
            os.mkdir(dp)

    # Download missing stream subtitles
    for key, stream in streams.items():
        if not os.path.isfile(stream.subtitles_path):
            download(key, stream.subtitles_path)
