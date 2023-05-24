"""Usage:
  convert --all
  convert --stream <id> [<file>]

Options:
  --all     Get all filenames and styles from database. Without this argument
            converter will not change global style of subtitles.
  --stream  Same as --all, but converts only one stream.
"""

import os
import re
from typing import List, Iterator
from multiprocessing import Pool

import tcd
from tcd.twitch import Message
from tcd.subtitles import SubtitlesASS
from docopt import docopt

from ..data.streams import Stream, StreamType
from ..data.loader.default import streams
from ..data.cache import cache
from ..config import tcd_config
from ..data.timecodes import Timecodes
from ..data.blacklist import Blacklist
from ..utils.ass import (EmptyLineError, SubtitlesReader,
                         SubtitlesWriter, SubtitlesEvent, SubtitlesStyle)


tcd.settings.update(tcd_config)

GROUPED_EMOTES = re.compile('([^\ ]+) x⁣([0-9]+)')


def unpack_emotes(line: str, pattern: re.Pattern = GROUPED_EMOTES) -> str:
    """Reverse changes made by tcd.twitch.Message.group()."""
    result = line

    for m in reversed(list(pattern.finditer(line))):
        mg = m.groups()
        ms = m.span()

        emote = mg[0].replace(' ', ' ')  # thin space to regular space
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


def unpack_line_breaks(line: str) -> str:
    """Reverse changes made by tcd.subtitles.SubtitleASS.wrap()."""
    return line.replace('\\N', '')


def convert_msg(msg: SubtitlesEvent, blacklist: Blacklist) -> SubtitlesEvent:
    """Reapply all TCD settings for messages."""

    # Unpack message text
    text = unpack_line_breaks(msg.text)
    text = unpack_emotes(text)

    # Disable blacklisted messages
    msg.text = text
    msg.disabled = msg in blacklist

    # Repack emote groups
    text = Message.group(text, **tcd_config['group_repeating_emotes'])

    # Update message duration
    msg.duration = SubtitlesASS._duration(text)

    # Recreate line breaks
    text = SubtitlesASS.wrap(msg.username, text)

    msg.text = text

    return msg


def convert(ifn: str, ofn: str = None,
            style: SubtitlesStyle = None,
            func=lambda msg: msg):

    if ofn is None or ofn == ifn:
        ofn = f'{ifn}.tmp'
        replace = True
    else:
        replace = False

    r = SubtitlesReader(ifn)
    w = SubtitlesWriter(ofn, r.header, style if style else r.style)

    for event in r.events():
        try:
            event = func(event)

            if event is None:
                continue

            w.write(event)
        except EmptyLineError:
            continue

    r.close()
    w.close()

    if replace:
        os.rename(ofn, ifn)


def cut_subtitles(cuts: Timecodes, fi: str, fo: str = None):
    def rebase_msg(event):
        time = event.start

        # Drop all cut messages
        for cut in cuts:
            if cut.start <= time <= cut.end:
                raise EmptyLineError()

        # Rebase messages after cuts
        delta = sum([cut.duration for cut in cuts if cut <= time])
        event.start -= int(delta)
        event.end -= int(delta)

        return event

    convert(fi, fo, func=rebase_msg)


def find_subtitles(stream: Stream) -> str:
    if os.path.exists(stream.subtitles_path):
        return stream.subtitles_path
    else:
        return stream.subtitles


def concatenate_subtitles(stream_list: List[Stream], offsets: Timecodes, fo: str):
    def events() -> Iterator[SubtitlesEvent]:
        for i, stream in enumerate(stream_list):
            if stream[0].generated_subtitles_hash:
                r = SubtitlesReader(stream[0].generated_subtitles_path)
            else:
                r = SubtitlesReader(find_subtitles(stream))
            offset = -int(offsets[i])

            for event in r.events():
                event.start -= offset
                event.end -= offset
                yield event

            r.close()

    # Get metadata from the first file
    r = SubtitlesReader(find_subtitles(stream_list[0]))

    w = SubtitlesWriter(fo, r.header, r.style, r.event_format)

    r.close()

    for event in events():
        w.write(event)

    w.close()


def generate_subtitles(segment):
    cache_key = f'generated-subtitles-{segment.hash}'
    cache_hash = segment.generated_subtitles_hash

    if cache_hash is None:
        if cache_key in cache:
            print(f'Removing generated subtitles of segment {segment.hash}')
            os.unlink(segment.generated_subtitles_path)
            cache.remove(cache_key)

        return

    if cache_key in cache and cache.get(cache_key) == cache_hash:
        return

    print(f'Generating subtitles for segment {segment.hash}')

    fo = segment.generated_subtitles_path

    if os.path.exists(fo):
        os.unlink(fo)

    try:
        if segment.stream.type is StreamType.JOINED:
            concatenate_subtitles(segment.stream.streams, segment.offsets, fo)
            fi = fo
        else:
            fi = find_subtitles(segment.stream)

            if len(segment.all_cuts) > 0:
                cut_subtitles(segment.all_cuts, fi, fo)
    except FileNotFoundError as ex:
        print(f'Skipping segment {segment.hash}: {ex.filename} does not exist')
        if os.path.exists(fo):
            os.unlink(fo)
        return
    except Exception:
        if os.path.exists(fo):
            os.unlink(fo)
        if os.path.exists(fo + '.tmp'):
            os.unlink(fo + '.tmp')
        raise

    cache.set(cache_key, cache_hash)


def convert_file(file: str, blacklist: Blacklist, style: SubtitlesStyle = None):
    print(f'Converting {file}')
    return convert(file, style=style,
                   func=lambda msg: convert_msg(msg, blacklist))


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    if args['--all']:
        tasks = [(s.subtitles_path, s.blacklist, s.subtitles_style)
                 for s in streams.values()
                 if s.type is StreamType.DEFAULT and os.path.exists(s.subtitles_path)]
    elif args['--stream']:
        s = streams[args['<id>']]
        if args['<file>']:
            tasks = [(args['<file>'], s.blacklist, s.subtitles_style)]
        else:
            if not os.path.exists(s.subtitles_path):
                raise FileNotFoundError
            tasks = [(s.subtitles_path, s.blacklist, s.subtitles_style)]

    p = Pool(4)
    p.starmap(convert_file, tasks)
    p.close()


if __name__ == '__main__':
    main()
