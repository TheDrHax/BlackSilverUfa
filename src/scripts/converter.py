"""Usage:
  convert --all
  convert <file>...
"""

import os
import re
from multiprocessing import Pool

import tcd
from docopt import docopt
from tcd.twitch import Message
from tcd.subtitles import Subtitle

from ..utils.ass import convert
from ..data.config import tcd_config


tcd.settings.update(tcd_config)


PACKED_EMOTE = re.compile('([^\ ]+) x⁣([0-9]+)')


def unpack_emotes(line):
    result = line

    for m in reversed(list(PACKED_EMOTE.finditer(line))):
        mg = m.groups()
        ms = m.span()

        emote = mg[0]
        count = int(mg[1])

        if count > 200:
            print(f'Ignoring line: {line}')
            continue

        result = ''.join((result[:ms[0]],
                          ' '.join([emote] * int(count)),
                          result[ms[1]:]))

        if len(result) > 500:
            print(f'{len(result)}/500 chars: {line}')
            return line

    return result


def convert_msg(msg):
    # Repack emote groups
    text = unpack_emotes(msg.text)
    text = Message.group(text, format='{emote} x⁣{count}', collocations=10)
    msg.text = text

    # Update message durations
    msg.duration = Subtitle._duration(text)

    return msg


def convert_file(file):
    print(f'Converting {file}')
    return convert(file, func=convert_msg)


def chats():
    for year in os.listdir('./_site/chats'):
        for filename in os.listdir(f'./_site/chats/{year}'):
            if filename.startswith('v') and filename.endswith('.ass'):
                yield f'./_site/chats/{year}/{filename}'


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    if args['--all']:
        p = Pool(8)
        p.map(convert_file, chats())
        p.close()
    else:
        for chat in args['<file>']:
            convert_file(chat)


if __name__ == '__main__':
    main()
