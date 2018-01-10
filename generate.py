#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

import os
import io
import json

import tcd

from string import Template


class Readme(object):
    @staticmethod
    def count_format(i):
        if i == 1:
            return "{0} стрим".format(i)
        elif i in [2, 3, 4]:
            return "{0} стрима".format(i)
        else:
            return "{0} стримов".format(i)

    @staticmethod
    def generate_category(category):
        title = "\n{0} {1[name]}"
        entry = "* [{0[name]}](links/{0[filename]}) ({1})"

        result = [title.format('#'*category['level'], category)]
        for game in category['games']:
            count = Readme.count_format(len(game['streams']))
            result.append(entry.format(game, count))
        return result

    @staticmethod
    def generate_list(category):
        title = "\n{0} [{1[name]}](links/{1[games][0][filename]})"
        entry = "* {0[name]}"

        result = [title.format('#'*category['level'], category)]
        for stream in category['games'][0]['streams']:
            result.append(entry.format(stream))
        return result

    def __init__(self, categories):
        self.categories = categories

        with io.open("templates/README.md", "r", encoding="utf-8") as f:
            self.template = Template(f.read())

    def write(self, output):
        content = []
        for category in categories:
            if category.get('type') is None:
                content += Readme.generate_category(category)
            elif category['type'] == 'list':
                content += Readme.generate_list(category)

        d = {"content": '\n'.join(content)}
        output.write(self.template.substitute(d))


class Stream(object):
    def __init__(self, stream):
        self.stream = stream

        with io.open("templates/stream.md", "r", encoding="utf-8") as f:
            self.template = Template(f.read())

    def generate(self):
        link_twitch = "[{0}](https://www.twitch.tv/videos/{0})"
        link_chat = "[v{0}.ass](../chats/v{0}.ass)"
        link_youtube = "[{0}](https://www.youtube.com/watch?v={0})"
        cmd_twitch = "streamlink -p \"mpv --sub-file chats/v{0}.ass\" " \
                     "--player-passthrough hls twitch.tv/videos/{0} best"
        cmd_youtube = "mpv --sub-file chats/v{0}.ass ytdl://{1}"
        link_player = "<a href=\"/src/player.html?v={1}&s={0}\" " \
                      "onclick=\"return openPlayer{0}()\">▶</a>"

        d = {"name": self.stream['name']}

        d['twitch'] = self.stream['twitch']
        d['TWITCH_LINK'] = link_twitch.format(self.stream['twitch'])
        d['CHAT_LINK'] = link_chat.format(self.stream['twitch'])

        if self.stream.get('youtube') is None:
            d['youtube'] = ""
            d['YOUTUBE_LINK'] = "Запись отсутствует"
            d['PLAYER_LINK'] = ""
            d['PLAYER_CMD'] = cmd_twitch.format(self.stream['twitch'])
        else:
            d['youtube'] = self.stream['youtube']
            d['YOUTUBE_LINK'] = link_youtube.format(self.stream['youtube'])
            d['PLAYER_LINK'] = link_player.format(self.stream['twitch'],
                                                  self.stream['youtube'])
            d['PLAYER_CMD'] = cmd_youtube.format(self.stream['twitch'],
                                                 self.stream['youtube'])

        return self.template.substitute(d)


class Game(object):
    def __init__(self, game):
        self.game = game

        with io.open("templates/page.md", "r", encoding="utf-8") as f:
            self.template = Template(f.read())

    def write(self, output):
        content = []
        for stream in self.game['streams']:
            content.append(Stream(stream).generate())

            if not os.path.isfile("chats/v{0[twitch]}.ass".format(stream)):
                print("Скачиваю чат для стрима {0[twitch]}".format(stream))
                tcd.download(stream['twitch'])

        d = {"title": self.game['name'], "content": '\n'.join(content)}
        output.write(self.template.substitute(d))


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

    with io.open("README.md", "w+", encoding="utf-8") as output:
        Readme(categories).write(output)

    if not os.path.isdir("links"):
        os.mkdir("links")

    for game in games:
        filename = "links/{0[filename]}".format(game)
        with io.open(filename, "w+", encoding="utf-8") as output:
            Game(game).write(output)
