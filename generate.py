#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

import os
import io
import json

import tcd

from mako.template import Template


if __name__ == "__main__":
    with io.open("data/games.json", "r", encoding="utf-8") as f1, \
         io.open("data/categories.json", "r", encoding="utf-8") as f2:
        games = json.load(f1)
        categories = json.load(f2)

    for category in categories:
        category['games'] = []
        for game in games:
            if category['code'] == game['category']:
                category['games'].append(game)

    # Create required directores
    for directory in ['chats', 'links']:
        if not os.path.isdir(directory):
            os.mkdir(directory)

    # Download missing stream subtitles
    for game in games:
        for stream in game['streams']:
            if not os.path.isfile("chats/v{0[twitch]}.ass".format(stream)):
                print("Скачиваю чат для стрима {0[twitch]}".format(stream))
                tcd.download(stream['twitch'])

    # Generate README.md
    with io.open("README.md", "w+", encoding="utf-8") as output:
        t = Template(filename="templates/README.mako", input_encoding="utf-8")
        output.write(t.render(categories=categories).strip())

    # Generate links/*.md
    t = Template(filename="templates/page.mako", input_encoding="utf-8")
    for game in games:
        filename = "links/{0[filename]}".format(game)
        with io.open(filename, "w+", encoding="utf-8") as output:
            output.write(t.render(game=game).strip())
