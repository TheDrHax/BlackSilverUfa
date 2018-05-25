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
        filename = _('chats/v{}.ass'.format(stream))
        if not os.path.isfile(filename):
            print("Downloading chat {}".format(filename))
            tcd.download(stream)
