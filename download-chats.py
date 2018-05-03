#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import tcd
from templates.utils import load_json


if __name__ == '__main__':
    streams = load_json('data/streams.json')

    # Create destination directory
    if not os.path.isdir('chats'):
        os.mkdir('chats')

    # Download missing stream subtitles
    for stream in streams:
        if not os.path.isfile("chats/v{0}.ass".format(stream)):
            print("Downloading stream {0} => chats/v{0}.ass".format(stream))
            tcd.download(stream)
