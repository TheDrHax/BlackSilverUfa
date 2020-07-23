import os
from ..utils import load_json


tcd_config = load_json('data/tcd.json')
config = load_json('data/config.json')
DEBUG = os.environ.get('DEBUG', '0') == '1'


if DEBUG:
    config['prefix'] = config['dev_prefix']
    for year in config['repos']['chats'].keys():
        config['repos']['chats'][year]['prefix'] = f'{config["prefix"]}/chats/{year}'