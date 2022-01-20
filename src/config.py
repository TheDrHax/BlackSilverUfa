import os
from .utils import load_json


def convert_path(path: str) -> str:
    parts = path.replace('$PREFIX', os.environ['PREFIX']).split('/')
    return os.path.join(*parts)


tcd_config = load_json('config/tcd.json')
config = load_json('config/config.json')
DEBUG = os.environ.get('DEBUG', '0') == '1'


if DEBUG:
    config['prefix'] = ''

    for path, mount in config['repos']['mounts'].items():
        if not path.startswith('$PREFIX/chats'):
            continue

        if os.path.exists(convert_path(path)):
            mount['prefix'] = path.replace('$PREFIX', config['prefix'])
