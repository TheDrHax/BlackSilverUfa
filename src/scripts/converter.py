import os
import re
from ..utils.ass import convert as convert_ass
from tcd.twitch import Message
from multiprocessing import Pool
# from datetime import timedelta


# T_MIN = 2
# T_MAX = 5
# MSG_MAX = 100


# def convert_time(t, msg_len):
#     part = (MSG_MAX - min(msg_len, MSG_MAX)) / MSG_MAX
#     duration = T_MAX - (T_MAX - T_MIN) * part
#     return t + timedelta(seconds=duration)


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
    # Update emote groups
    text = unpack_emotes(msg.text)
    text = Message.group(text, format='{emote} x⁣{count}', collocations=10)
    msg.text = text

    # Convert message durations
    # msg_len = len(msg[msg.index(': ') + 2:])
    # msg.duration = convert_time(msg.start, msg_len)

    return msg


def convert_file(file):
    print(f'Converting {file}')
    return convert_ass(file, func=convert_msg)


def chats():
    for year in os.listdir('./_site/chats'):
        for chat in os.listdir(f'./_site/chats/{year}'):
            yield f'./_site/chats/{year}/{chat}'


if __name__ == '__main__':
    p = Pool(8)
    p.map(convert_file, chats())
    p.close()