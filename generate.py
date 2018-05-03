#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import shutil
from mako.lookup import TemplateLookup
from templates.utils import load_json, _


lookup = TemplateLookup(directories=['./templates'],
                        module_directory='/tmp/mako_modules',
                        input_encoding='utf-8')


def load_data():
    args = {'_': _}

    for data in ['config', 'games', 'categories', 'streams']:
        args[data] = load_json("data/{}.json".format(data))

    # Populate games with streams info
    for game in args['games']:
        for stream in game['streams']:
            stream_info = args['streams'][stream['twitch']]
            if type(stream_info) is dict:
                stream.update(stream_info)
            elif type(stream_info) is list:
                stream.update(stream_info[stream['segment']])

    # Populate categories with games
    for category in args['categories']:
        category['games'] = []
        for game in args['games']:
            if category['code'] == game['category']:
                category['games'].append(game)

    return args


if __name__ == "__main__":
    args = load_data()

    # Recreate required directores
    if not os.path.isdir(_('')):
        os.mkdir(_(''))
    for dp in ['links', 'src']:
        if os.path.isdir(_(dp)):
            shutil.rmtree(_(dp))
        os.mkdir(_(dp))

    # Copy static files
    if os.path.isdir(_('static')):
        shutil.rmtree(_('static'))
    shutil.copytree('static', _('static'))

    # Generate index.html
    with open(_("index.html"), "w") as out:
        t = lookup.get_template('/index.mako')
        out.write(t.render(**args))

    # Generate src/player.html for backward compatibility
    with open(_("src/player.html"), "w") as output:
        t = lookup.get_template('/redirect.mako')
        output.write(t.render(**args).strip())

    # Generate links/*.md
    t = lookup.get_template('/links.mako')
    for game in args['games']:
        filename = "links/{0[filename]}".format(game)
        with open(_(filename), "w") as out:
            out.write(t.render(game=game, **args).strip())
