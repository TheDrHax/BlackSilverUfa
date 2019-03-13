#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import tcd
import requests

from . import _, load_json
from ..data import config, streams


tcd.settings.update(load_json('data/tcd.json'))


def download(id, dest):
    if config.get('fallback_source'):
        base_url = config['fallback_source']
        url = f'{base_url}/{id}.ass'

        if requests.head(url).status_code == 200:
            print(f'Downloading chat {filename} via fallback source')
            try:
                r = requests.get(url)
                with open(dest, 'wb') as of:
                    for chunk in r.iter_content(chunk_size=1024):
                        of.write(chunk)
                return
            except Exception as ex:
                print(ex)
                os.unlink(dest)

    print(f'Downloading chat {filename} via TCD')
    tcd.download(id)


if __name__ == '__main__':
    # Create destination directory
    for dp in [_(''), _('chats')]:
        if not os.path.isdir(dp):
            os.mkdir(dp)

    # Download missing stream subtitles
    for stream in streams:
        filename = _(f'chats/v{stream}.ass')
        if not os.path.isfile(filename):
            download(stream, filename)
