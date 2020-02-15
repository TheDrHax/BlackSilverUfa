#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import shutil

from mako.lookup import TemplateLookup
from sortedcontainers import SortedDict

from . import _
from ..data import config, streams, games, categories
from ..data.config import DEBUG


lookup = TemplateLookup(directories=['./templates'],
                        input_encoding='utf-8')


def generate():
    args = {
        '_': _,
        'config': config,
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

    # Create debug marker
    if DEBUG:
        open(_('.DEBUG'), 'a').close()
    elif os.path.exists(_('.DEBUG')):
        os.unlink(_('.DEBUG'))

    # Create directory for generated data
    if not os.path.isdir(_('data')):
        os.mkdir(_('data'))

    # Copy static files
    if os.path.isdir(_('static')):
        shutil.rmtree(_('static'))
    shutil.copytree('static', _('static'))
    shutil.copyfile(_('static/html/redirect.html'), _('r/index.html'))
    shutil.copyfile(_('r/index.html'), _('src/player.html'))  # compatibility
    shutil.rmtree(_('static/html'))

    # Generate preprocessed timecodes.json
    tc_dict = SortedDict()
    for segment in streams.segments:
        if segment.timecodes:
            tc_dict[segment.hash] = segment.timecodes.to_dict()
    with open(_("data/timecodes.json"), 'w') as fo:
        json.dump(tc_dict, fo, ensure_ascii=False, indent=2)

    # Generate scripts
    with open(_("search.js"), "w") as output:
        t = lookup.get_template('/search.mako')
        output.write(t.render(**args).strip())

    # Generate index.html, missing.html
    for i in ['index', 'missing']:
        with open(_(i + '.html'), "w") as out:
            t = lookup.get_template(f'/{i}.mako')
            out.write(t.render(**args))

    # Generate links/*.html
    t = lookup.get_template('/links.mako')
    for game in args['games']:
        with open(_(game.filename), "w") as out:
            out.write(t.render(game=game, **args).strip())


if __name__ == "__main__":
    generate()
