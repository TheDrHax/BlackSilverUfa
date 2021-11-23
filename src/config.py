import os
from .utils import load_json


def convert_path(path: str) -> str:
    parts = path.replace('$PREFIX', os.environ['PREFIX']).split('/')
    return os.path.join(*parts)


tcd_config = load_json('config/tcd.json')
config = load_json('config/config.json')
DEBUG = os.environ.get('DEBUG', '0') == '1'


if DEBUG:
    config['prefix'] = config['dev_prefix']

    for path, mount in config['repos']['mounts'].items():
        if not path.startswith('$PREFIX/chats'):
            continue

        mount['prefix'] = convert_path(config['prefix'])
