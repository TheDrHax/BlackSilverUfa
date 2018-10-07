#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import tcd
from templates.data import streams
from templates.utils import _


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
