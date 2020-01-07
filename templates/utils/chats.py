#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import tcd
import requests

from . import _, load_json
from ..data import config, streams


tcd_config = load_json('data/tcd.json')


def download(key, dest):
    fallback = config['fallback']
    if fallback['chats']:
        base_url = fallback['prefix']
        url = f'{base_url}/{key}.ass'

        if requests.head(url, allow_redirects=fallback['redirects']).status_code == 200:
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
    tcd.download(key)


if __name__ == '__main__':
    # Create destination directory
    for dp in [_(''), _('chats')]:
        if not os.path.isdir(dp):
            os.mkdir(dp)

    # Download missing stream subtitles
    for key, stream in streams.items():
        if not os.path.isfile(stream.subtitles_path):
            download(key, stream.subtitles_path)
