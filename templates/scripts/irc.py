#!/usr/bin/env python3
# -*- coding: utf-8 -*-

HELP = """
This script converts IRC logs to chat subtitles.

Usage: ./bsu python -m templates.scripts.irc <INPUT> <START> <DURATION> <ID>
    INPUT - Name of IRC log file
    START - Date and time of stream start (ISO 8601, UTC)
    DURATION - Length of stream (HH:MM:SS)
    ID - Twitch VOD ID
"""

import tcd
import sys

from datetime import datetime, timedelta
from tcd.twitch import Message
from tcd.subtitles import SubtitleWriter

from ..utils import load_json
from ..data.timecodes import Timecode


tcd.settings.update(load_json('data/tcd.json'))


def irc_params(params):
    params = params.split(';')

    result = {}
    for p in params:
        parts = p.split('=')
        result[parts[0]] = parts[1]

    return result        


def parser(input: str, start: datetime, duration: datetime):
    with open(input, 'r') as fi:
        for line in fi:
            parts = line.split(' ')
            ts = datetime.fromisoformat(parts[0])

            if ts < start or parts[1] != 'privmsg':
                continue

            if ts > start + duration:
                break
            
            params = irc_params(parts[2])
            user = parts[3][1:]
            text = ' '.join(parts[4:])[1:].strip()

            yield Message({
                'commenter': {
                    'display_name': params['display-name']
                },
                'message': {
                    'body': text,
                    'user_color': (params.get('color') or '#FFFFFF')[1:]
                },
                'content_offset_seconds': (ts - start).total_seconds()
            })


if __name__ == '__main__':
    if len(sys.argv) != 5:
        print(HELP)
        sys.exit(1)
    
    INPUT = sys.argv[1]
    START = datetime.fromisoformat(sys.argv[2])
    DURATION = timedelta(seconds=int(Timecode(sys.argv[3])))
    ID = sys.argv[4]

    writer = tcd.subtitles.SubtitleWriter(ID)
    
    for msg in parser(INPUT, START, DURATION):
        writer.add(msg)
    
    writer.close()
