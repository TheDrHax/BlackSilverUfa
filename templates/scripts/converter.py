#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
from datetime import timedelta, datetime as dtt


T_MIN = 2
T_MAX = 5
MSG_MAX = 100


def ptime(t):
    return dtt.strptime(t, '%H:%M:%S.%f')


def ftime(t):
    return dtt.strftime(t, '%-H:%M:%S.%f')[:-4]


def convert_time(t, msg_len):
    part = (MSG_MAX - min(msg_len, MSG_MAX)) / MSG_MAX
    duration = T_MAX - (T_MAX - T_MIN) * part
    return t + timedelta(seconds=duration)


def convert_line(input):
    msg_split = input.split(', ', 9)

    msg = msg_split[9]
    msg_len = len(msg[msg.index(': ') + 2:])

    t_start = ptime(msg_split[1])
    t_end = convert_time(t_start, msg_len)

    msg_split[2] = ftime(t_end)
    return ', '.join(msg_split)


def convert_file(input):
    with open(input, 'r') as f_in, open(input + '.tmp', 'w') as f_out:
        for line in f_in:
            if line.startswith('Dialogue: '):
                line = convert_line(line)

            f_out.write(line)

    os.rename(input + '.tmp', input)


if __name__ == '__main__':
    for i in os.listdir('../_site/chats/'):
        print('Converting ' + i)
        convert_file('../_site/chats/' + i)
