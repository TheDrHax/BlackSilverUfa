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
         io.open("data/categories.json", "r", encoding="utf-8") as f2, \
         io.open("data/streams.json", "r", encoding="utf-8") as f3:
        games = json.load(f1)
        categories = json.load(f2)
        streams = json.load(f3)

    # Populate games with streams info
    for game in games:
        for stream in game['streams']:
            if streams[stream['twitch']]:
                stream.update(streams[stream['twitch']])

    # Populate categories with games
    for category in categories:
        category['games'] = []
        for game in games:
            if category['code'] == game['category']:
                category['games'].append(game)

    # Create required directores
    for directory in ['chats', 'links', 'src']:
        if not os.path.isdir(directory):
            os.mkdir(directory)

    # Download missing stream subtitles
    for stream in streams:
        if not os.path.isfile("chats/v{0}.ass".format(stream)):
            tcd.download(stream)

    # Generate README.md
    with io.open("README.md", "w+", encoding="utf-8") as output:
        t = Template(filename="templates/README.mako", input_encoding="utf-8")
        output.write(t.render(categories=categories, games=games).strip())

    # Generate src/player.html for backward compatibility
    with io.open("src/player.html", "w+", encoding="utf-8") as output:
        t = Template(filename="templates/player.mako", input_encoding="utf-8")
        output.write(t.render(games=games).strip())

    # Generate links/*.md
    t = Template(filename="templates/page.mako", input_encoding="utf-8")
    for game in games:
        filename = "links/{0[filename]}".format(game)
        with io.open(filename, "w+", encoding="utf-8") as output:
            output.write(t.render(game=game).strip())
