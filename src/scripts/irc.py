"""Usage:
  irc <source> <start> <duration> <vod> [--plot]
  irc (--current | <vod>) [--plot]

Options:
  --current   Download chat for stream that is currently online. Uses custom
              API endpoint.
  --plot      Plot the frequency of emotes during the stream.

This script converts IRC logs to chat subtitles.

source      Path or URL of IRC log file
start       Date and time of stream start (ISO 8601, UTC)
duration    Length of stream (HH:MM:SS)
vod         Twitch VOD ID
"""


from datetime import datetime, timedelta

import requests
from docopt import docopt

from ..data.streams import Stream
from ..data.loader.default import streams
from ..data.timecodes import Timecode
from ..utils.ass import SubtitlesEvent, SubtitlesWriter
from .converter import generate_subtitles
from .plot import main as plot


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

        if len(parts) < 2:
            continue

        if parts[1] != 'privmsg':
            continue

        # For some reason IRC log is behind chat
        # This needs to be confirmed for more streams
        ts = datetime.fromisoformat(parts[0]) - timedelta(seconds=5)

        if ts < start:
            continue
        elif ts > start + duration:
            break

        params = irc_params(parts[2])

        msg = SubtitlesEvent()

        msg.start = (ts - start).total_seconds()
        msg.duration = 5

        msg.username = params['display-name']
        msg.text = ' '.join(parts[4:])[1:].strip()

        color = params.get('color') or '#FFFFFF'
        msg.color_bgr = color[5:7] + color[3:5] + color[1:3]

        yield msg

    if not isinstance(fi, list):
        fi.close()


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    if args['--current'] or args['<vod>'] and not args['<source>']:
        if args['--current']:
            stream = requests.get('https://red.drhx.ru/blackufa/twitch').json()
            vod = stream['vod']
        else:
            vod = args['<vod>']
            stream = requests.get(f'https://red.drhx.ru/blackufa/twitch/{vod}').json()

        date = stream['date'].split('T')[0]

        source = f'https://bsufiles.drhx.ru/logs/{date}.log'
        start = datetime.fromisoformat(stream['date'].rstrip('Z'))

        if stream['active']:
            duration = datetime.now() - start
        else:
            end = datetime.fromisoformat(stream['date_end'].rstrip('Z'))
            duration = end - start
    else:
        source = args['<source>']
        start = datetime.fromisoformat(args['<start>'])
        duration = timedelta(seconds=int(Timecode(args['<duration>'])))
        vod = args['<vod>']

    if vod not in streams:
        print(f'Adding stream {vod}')
        streams[vod] = Stream(key=vod, data=[{}])
        streams.save()

    writer = SubtitlesWriter(streams[vod].subtitles_path)

    for msg in parser(source, start, duration):
        writer.write(msg)

    writer.close()

    if len(streams[vod].cuts) > 0:
        generate_subtitles(streams[vod][0], True)

    if args['--plot']:
        plot([vod])


if __name__ == '__main__':
    main()
