import os
import tcd
import requests

from . import _
from ..data.fallback import FallbackSource
from ..data import config, streams
from ..data.config import tcd_config
from ..scripts.converter import convert_file


fallback = FallbackSource(**config['fallback'])


def download(stream):
    key = stream.twitch
    dest = stream.subtitles_path

    if fallback.chats and f'{key}.ass' in fallback:
        url = fallback.url(f'{key}.ass')

        print(f'Downloading chat {key} via fallback source')

        try:
            r = requests.get(url)

            with open(dest, 'wb') as of:
                for chunk in r.iter_content(chunk_size=1024):
                    of.write(chunk)

            convert_file(dest, style=stream.subtitles_style)

            return
        except Exception as ex:
            print(ex)
            os.unlink(dest)

    print(f'Downloading chat {key} via TCD')
    tcd_config['directory'] = os.path.dirname(dest)
    tcd_config['ssa_style_default'] = stream.subtitles_style.compile()
    tcd.settings.update(tcd_config)

    try:
        tcd.download(key)
    except Exception as ex:
        print(ex)
        os.unlink(dest)


if __name__ == '__main__':
    # Create destination directory
    for dp in [_(''), _('chats')]:
        if not os.path.isdir(dp):
            os.mkdir(dp)

    # Download missing stream subtitles
    for key, stream in streams.items():
        if not os.path.isfile(stream.subtitles_path) and not stream.is_joined:
            download(stream)
