#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import shutil
from mako.lookup import TemplateLookup
from templates.data import streams, games, categories
from templates.data.utils import load_json
from templates.utils import _


lookup = TemplateLookup(directories=['./templates'],
                        module_directory='/tmp/mako_modules',
                        input_encoding='utf-8')


def generate():
    args = {
        '_': _,
        'config': load_json("data/config.json"),
        'streams': streams,
        'games': games,
        'categories': categories
    }

    # Recreate required directores
    if not os.path.isdir(_('')):
        os.mkdir(_(''))
    for dp in ['links', 'src', 'r']:
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
    shutil.copyfile(_("src/player.html"), _("r/index.html"))

    # Generate links/*.md
    t = lookup.get_template('/links.mako')
    for game in args['games']:
        filename = "links/{0[filename]}".format(game)
        with open(_(filename), "w") as out:
            out.write(t.render(game=game, **args).strip())


if __name__ == "__main__":
    generate()
