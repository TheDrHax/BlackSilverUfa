#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import shutil
from mako.lookup import TemplateLookup
from templates.data import streams, games, categories
from templates.utils import _, load_json


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

    # Generate scripts
    with open(_("search.js"), "w") as output:
        t = lookup.get_template('/search.mako')
        output.write(t.render(**args).strip())
    with open(_("r/index.html"), "w") as output:
        t = lookup.get_template('/redirect.mako')
        output.write(t.render(**args).strip())
    shutil.copyfile(_("r/index.html"), _("src/player.html"))  # compatibility

    # Generate index.html, missing.html
    for i in ['index', 'missing']:
        with open(_(i + '.html'), "w") as out:
            t = lookup.get_template('/{}.mako'.format(i))
            out.write(t.render(**args))

    # Generate links/*.md
    t = lookup.get_template('/links.mako')
    for game in args['games']:
        filename = "links/{0[filename]}".format(game)
        with open(_(filename), "w") as out:
            out.write(t.render(game=game, **args).strip())


if __name__ == "__main__":
    generate()
