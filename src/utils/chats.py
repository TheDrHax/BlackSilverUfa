import os
import tcd
import requests

from . import _
from ..data.fallback import FallbackSource
from ..data.streams import StreamType
from ..data.loader.default import streams
from ..data.cache import cache
from ..config import config, tcd_config
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
        except Exception as ex:
            os.unlink(dest)
            raise ex
    else:
        print(f'Downloading chat {key} via TCD')
        tcd_config['directory'] = os.path.dirname(dest)
        tcd_config['ssa_style_default'] = stream.subtitles_style.compile()
        tcd.settings.update(tcd_config)

        from tcd.twitch import client
        client.headers['Client-ID'] = tcd_config['client_id']

        try:
            tcd.download(key)
        except Exception as ex:
            os.unlink(dest)
            raise ex

    convert_file(dest, stream.blacklist, stream.subtitles_style)

    cache.remove(f'messages-{stream.twitch}')
    print(f'Downloaded {stream.messages} messages')


def download_missing():
    # Create destination directory
    for dp in [_(''), _('chats')]:
        if not os.path.isdir(dp):
            os.mkdir(dp)

    # Download missing stream subtitles
    for key, stream in streams.items():
        if stream.type is not StreamType.DEFAULT:
            continue

        if stream.messages > 0:
            continue

        download(stream)


if __name__ == '__main__':
    download_missing()
