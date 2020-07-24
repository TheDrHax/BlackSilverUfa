"""Usage: irc <source> <start> <duration> <vod>

This script converts IRC logs to chat subtitles.

source      Path or URL of IRC log file
start       Date and time of stream start (ISO 8601, UTC)
duration    Length of stream (HH:MM:SS)
vod         Twitch VOD ID
"""


from datetime import datetime, timedelta

import requests
from docopt import docopt
from tcd.twitch import Message
from tcd.settings import settings as tcd_settings
from tcd.subtitles import SubtitleWriter

from ..data.config import tcd_config
from ..data.timecodes import Timecode


tcd_settings.update(tcd_config)


def irc_params(params):
    params = params.split(';')

    result = {}
    for p in params:
        parts = p.split('=')
        result[parts[0]] = parts[1]

    return result


def parser(source: str, start: datetime, duration: datetime):
    if source.startswith('http'):
        fi = requests.get(source).content.decode('utf-8').split('\n')
    else:
        fi = open(source, 'r')

    for line in fi:
        parts = line.split(' ')

        if parts[1] != 'privmsg':
            continue

        # For some reason IRC log is behind chat by 11 seconds
        # This needs to be confirmed for more streams
        ts = datetime.fromisoformat(parts[0]) - timedelta(seconds=11)

        if ts < start:
            continue
        elif ts > start + duration:
            break

        params = irc_params(parts[2])
        message = ' '.join(parts[4:])[1:].strip()

        yield Message({
            'commenter': {
                'display_name': params['display-name']
            },
            'message': {
                'body': message,
                'user_color': (params.get('color') or '#FFFFFF')[1:]
            },
            'content_offset_seconds': (ts - start).total_seconds()
        })

    if not isinstance(fi, list):
        fi.close()


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    source = args['<source>']
    start = datetime.fromisoformat(args['<start>'])
    duration = timedelta(seconds=int(Timecode(args['<duration>'])))
    vod = args['<vod>']

    writer = SubtitleWriter(vod)

    for msg in parser(source, start, duration):
        writer.add(msg)

    writer.close()


if __name__ == '__main__':
    main()
