import base64
import json
from requests import Session
from . import _, load_json


s = Session()


def get_url(source, id):
    if source == 'twitch':
        return f'https://static-cdn.jtvnw.net/emoticons/v2/{id}/static/dark/1.0'
    elif source == 'betterttv':
        return f'https://cdn.betterttv.net/emote/{id}/1x'
    elif source == 'frankerfacez':
        return f'https://cdn.frankerfacez.com/emote/{id}/1'


def inline_image(url):
    res = s.get(url)

    if res.status_code != 200:
        raise Exception(f'Unable to download emote: {url} '
                        f'(code: {res.status_code})')

    content = base64.b64encode(res.content).decode()
    ctype = res.headers.get('content-type') or 'image/png'
    return f'data:{ctype};filename=image;base64,{content}'


def update_emotes():
    try:
        data = s.get('https://red.thedrhax.pw/blackufa/emotes').json()
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
