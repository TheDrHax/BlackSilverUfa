"""Usage:
    emotes update
    emotes (pack | unpack) [<path>]
"""

import base64
import json
from docopt import docopt
from requests import Session
from subprocess import Popen, PIPE
from ..utils import _, load_json


s = Session()


def get_url(source, id):
    if source == 'twitch':
        return f'https://static-cdn.jtvnw.net/emoticons/v2/{id}/default/dark/1.0'
    elif source == 'betterttv':
        return f'https://cdn.betterttv.net/emote/{id}/1x'
    elif source == 'frankerfacez':
        return f'https://cdn.frankerfacez.com/emote/{id}/1'


def convert_to_webp(content):
    command = 'ffmpeg -hide_banner -i - -preset icon -lossless 1 -loop 0 -f webp -'
    p = Popen(command.split(' '), stdin=PIPE, stdout=PIPE, stderr=PIPE)

    assert p.stdin
    p.stdin.write(content)
    p.stdin.close()
    p.wait()

    if p.returncode != 0:
        if p.stderr:
            print(p.stderr.read().decode())
        raise Exception(f'ffmpeg exited with non-zero code {p.returncode}')

    assert p.stdout
    return p.stdout.read()


def inline_image(url):
    res = s.get(url)

    if res.status_code != 200:
        raise Exception(f'Unable to download emote: {url} '
                        f'(code: {res.status_code})')

    content = res.content
    ctype = res.headers.get('content-type') or 'image/png'

    if ctype != 'image/webp':
        try:
            content = convert_to_webp(content)
            ctype = 'image/webp'
        except Exception as ex:
            print(ex)

    content = base64.b64encode(content).decode()
    return f'data:{ctype};filename=image;base64,{content}'


def update_emotes():
    try:
        data = s.get('https://red.drhx.ru/blackufa/emotes').json()
    except Exception:
        print('Unable to get emote data')
        return

    emotes = load_json(_('data/emotes.json')) or {}

    for emote in data:
        if emote['name'] in emotes:
            cached_emote = emotes[emote['name']]

            if cached_emote['id'] == emote['id']:
                continue

        print(f'Updating emote: {emote["name"]}')

        url = get_url(emote['source'], emote['id'])

        try:
            image = inline_image(url)
        except Exception as ex:
            print(f'Skipping emote {emote["name"]} ({ex})')
            continue

        emotes[emote['name']] = dict(id=emote['id'], src=image)

    with open(_('data/emotes.json'), 'w') as fo:
        json.dump(emotes, fo, ensure_ascii=False, indent=2)


def unpack(dest = './emotes'):
    import os

    if not os.path.exists(dest):
        os.mkdir(dest)

    [os.unlink(os.path.join(dest, f)) for f in os.listdir(dest)]

    emotes = load_json(_('data/emotes.json')) or {}

    for name, emote in emotes.items():
        ext = emote['src'].split('/')[1].split(';')[0]
        filename = f'{name}.{ext}'

        with open(os.path.join(dest, filename), 'wb') as fo:
            fo.write(base64.b64decode(emote['src'].split('base64,')[1].encode()))


def pack(src = './emotes'):
    import os
    emotes = load_json(_('data/emotes.json')) or {}

    for filename in os.listdir(src):
        name, ext = filename.split('.')

        if name not in emotes:
            print(f'Skipping {filename} - emote does not exist')
            continue

        with open(os.path.join(src, filename), 'rb') as fi:
            content = base64.b64encode(fi.read()).decode()

        content = f'data:image/{ext};filename=image;base64,{content}'
        emotes[name]['src'] = content

    with open(_('data/emotes.json'), 'w') as fo:
        json.dump(emotes, fo, ensure_ascii=False, indent=2)


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    if args['pack']:
        pack(args['<path>'] or './emotes')
    elif args['unpack']:
        unpack(args['<path>'] or './emotes')
    elif args['update']:
        update_emotes()


if __name__ == '__main__':
    main()
