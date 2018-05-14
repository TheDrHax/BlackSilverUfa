#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import tcd
from templates.data import streams


prefix = './_site' if 'PREFIX' not in os.environ else os.environ['PREFIX']


if __name__ == '__main__':
    # Create destination directory
    for dp in [prefix, '{}/chats'.format(prefix)]:
        if not os.path.isdir(dp):
            os.mkdir(dp)

    # Download missing stream subtitles
    for stream in streams:
        if not os.path.isfile("{}/chats/v{}.ass".format(prefix, stream)):
            print("Downloading chat {}/chats/v{}.ass".format(prefix, stream))
            tcd.download(stream)
