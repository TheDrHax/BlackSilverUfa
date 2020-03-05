import os
import json
import shutil
from subprocess import call

from mako.lookup import TemplateLookup
from sortedcontainers import SortedDict

from . import _
from .ass import cut_subtitles
from ..data import config, streams, games, categories
from ..data.config import DEBUG


lookup = TemplateLookup(directories=['./src/mako'],
                        input_encoding='utf-8')


def generate():
    args = {
        '_': _,
        'config': config,
        'streams': streams,
        'games': games,
        'categories': categories
    }

    streams.enable_fallbacks()

    # Recreate required directores
    if not os.path.isdir(_('')):
        os.mkdir(_(''))
    for dp in ['links', 'src', 'r', 'dist']:
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

    tc_dict = SortedDict()

    for segment in streams.segments:
        # Generate preprocessed timecodes.json
        if len(segment.timecodes) > 0:
            tc_dict[segment.hash] = segment.timecodes.to_dict()

        # Generate cut subtitles
        if len(segment.cuts) > 0:
            cut_subtitles(segment)

    with open(_("data/timecodes.json"), 'w') as fo:
        json.dump(tc_dict, fo, ensure_ascii=False, indent=2)

    # Generate preprocessed segments.json
    streams.segments.save(_('data/segments.json'), compiled=True)

    # Generate preprocessed categories.json
    categories.save(_('data/categories.json'), compiled=True)

    # Webpack
    call(['npx', 'webpack',
          '--config', 'src/js/webpack.config.js',
          '--mode', 'development' if DEBUG else 'production',
          '--output-path', os.path.abspath(_('dist'))])

    # Generate index.html, missing.html
    for i in ['index', 'missing']:
        with open(_(i + '.html'), "w") as out:
            t = lookup.get_template(f'/{i}.mako')
            out.write(t.render(**args))

    # Generate redirects
    with open(_('r/index.html'), 'w') as out:
        t = lookup.get_template(f'/redirect.mako')
        out.write(t.render(**args))
    shutil.copyfile(_('r/index.html'), _('src/player.html'))  # for old links

    # Generate links/*.html
    t = lookup.get_template('/links.mako')
    for game in args['games']:
        with open(_(game.filename), "w") as out:
            out.write(t.render(game=game, **args).strip())


if __name__ == "__main__":
    generate()
