#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
from tcd.twitch import Message
from multiprocessing import Pool
# from datetime import timedelta, datetime as dtt


# T_MIN = 2
# T_MAX = 5
# MSG_MAX = 100


# def ptime(t):
#     return dtt.strptime(t, '%H:%M:%S.%f')


# def ftime(t):
#     return dtt.strftime(t, '%-H:%M:%S.%f')[:-4]


# def convert_time(t, msg_len):
#     part = (MSG_MAX - min(msg_len, MSG_MAX)) / MSG_MAX
#     duration = T_MAX - (T_MAX - T_MIN) * part
#     return t + timedelta(seconds=duration)


PACKED_EMOTE = re.compile('([^\ ]+) x⁣([0-9]+)')


class EmptyLineError(Exception):
    pass


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


def convert_line(line):
    msg_split = line.split(', ', 9)

    try:
        username, text = msg_split[9].split(': ', 1)
    except Exception as ex:
        raise EmptyLineError()

    # Unpack / Repack emotes
    text = unpack_emotes(text)
    text = Message.group(text, group_format='{emote} x⁣{count}')
    msg_split[9] = f'{username}: {text}'

    # Convert message durations
    # msg_len = len(msg[msg.index(': ') + 2:])
    # t_start = ptime(msg_split[1])
    # t_end = convert_time(t_start, msg_len)
    # msg_split[2] = ftime(t_end)

    return ', '.join(msg_split)


def convert_file(input_file):
    print('Converting ' + input_file)

    with open(input_file, 'r') as f_in, open(input_file + '.tmp', 'w') as f_out:
        for line in f_in:
            try:
                if line.startswith('Dialogue: '):
                    line = convert_line(line.strip()) + '\n'

                f_out.write(line)
            except EmptyLineError:
                continue

    os.rename(input_file + '.tmp', input_file)


if __name__ == '__main__':
    p = Pool(8)
    l = map(lambda x: './_site/chats/' + x, os.listdir('./_site/chats/'))
    p.map(convert_file, l)
    p.close()