#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import tcd

from . import _, load_json
from ..data import streams


tcd.settings.update(load_json('data/tcd.json'))


if __name__ == '__main__':
    # Create destination directory
    for dp in [_(''), _('chats')]:
        if not os.path.isdir(dp):
            os.mkdir(dp)

    # Download missing stream subtitles
    for stream in streams:
        filename = _(f'chats/v{stream}.ass')
        if not os.path.isfile(filename):
            print(f'Downloading chat {filename}')
            tcd.download(stream)
