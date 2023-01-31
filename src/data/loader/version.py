from ...config import config
from ...utils import load_json


def check_data_version():
    act = load_json('data/version.json')['version']
    req = config['versions']['data']

    if act['major'] != req['major']:
        raise ValueError('data version mismatch '
                         f'(major {act["major"]} != {req["major"]})')

    if act['minor'] < req['minor']:
        raise ValueError('data version mismatch '
                         f'(minor {act["minor"]} < {req["minor"]})')
