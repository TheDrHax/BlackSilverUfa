import re
import os
from hashlib import md5
from datetime import timedelta, datetime as dtt

import tcd
from tcd.twitch import Message as TCDMessage
from tcd.subtitles import SubtitlesASS

from ..data.cache import cache
from ..data.config import tcd_config


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


class EmptyLineError(Exception):
    pass


class Message:
    @staticmethod
    def _ptime(t):
        return dtt.strptime(t, '%H:%M:%S.%f')

    @staticmethod
    def _ftime(t):
        return dtt.strftime(t, '%-H:%M:%S.%f')[:-4]

    @property
    def start(self):
        return self._ptime(self.fields['Start'])

    @start.setter
    def start(self, value):
        self.fields['Start'] = self._ftime(value)

    @property
    def end(self):
        return self._ptime(self.fields['End'])

    @end.setter
    def end(self, value):
        self.fields['End'] = self._ftime(value)

    @property
    def duration(self):
        return self.end - self.start

    @duration.setter
    def duration(self, value):
        self.end = self.start + timedelta(seconds=value)

    @property
    def color_bgr(self):
        username = self.fields['Text'].split(': ', 1)[0]
        if username.startswith('{\\c&H'):
            return username[5:11]
        else:
            return None

    @property
    def username(self):
        username = self.fields['Text'].split(': ', 1)[0]
        if self.color_bgr:
            username = username[13:len(username)-13]
        return username

    @property
    def text(self):
        return self.fields['Text'].split(': ', 1)[1]

    @text.setter
    def text(self, value):
        username = self.fields['Text'].split(': ', 1)[0]
        self.fields['Text'] = f'{username}: {value}'

    def __init__(self, line, event_format):
        self.format = event_format

        msg = line[10:].split(', ', len(event_format) - 1)
        self.fields = dict(zip(event_format, msg))

        try:
            self.text
        except Exception:
            raise EmptyLineError()

    def to_str(self, event_format=None):
        if not event_format:
            event_format = self.format

        return 'Dialogue: ' + ', '.join(
            [self.fields[field] for field in event_format])


def convert_msg(msg: Message) -> Message:
    """Reapply all TCD settings for messages."""

    # Remove line breaks
    text = unpack_line_breaks(msg.text)

    # Repack emote groups
    text = unpack_emotes(text)
    text = TCDMessage.group(text, **tcd_config['group_repeating_emotes'])

    # Update message durations
    msg.duration = SubtitlesASS._duration(text)

    # Recreate line breaks
    text = SubtitlesASS.wrap(msg.username, text)

    msg.text = text
    return msg


class SubtitlesStyle(dict):
    def __init__(self, format_line: str, style_line: str):
        if format_line.startswith('Format: '):
            format_line = format_line[8:].strip()

        if style_line.startswith('Style: '):
            style_line = style_line[7:].strip()

        self.format = list([field.strip() for field in format_line.split(',')])
        style = list([field.strip() for field in style_line.split(',')])
        self.update(zip(self.format, style))

    def compile(self) -> str:
        return 'Style: ' + ', '.join(self.values())


def convert(ifn: str, ofn: str = None,
            style: SubtitlesStyle = None,
            func=lambda msg: msg):

    if ofn is None:
        ofn = f'{ifn}.tmp'
        replace = True
    else:
        replace = False

    style_section = False
    event_section = False
    input_event_format = None
    output_event_format = tcd_config['ssa_events_format'][8:].split(', ')

    with open(ifn, 'r') as f_in, open(ofn, 'w') as f_out:
        for line in f_in:
            line = line.strip()

            if not style_section and line.startswith('[V4 Styles]'):
                style_section = True

            if style_section and style:
                if line.startswith('Format: '):
                    line = 'Format: ' + ', '.join(style.format)
                elif line.startswith('Style: '):
                    line = style.compile()

            if not event_section and line.startswith('[Events]'):
                style_section = False
                event_section = True

            if event_section:
                if line.startswith('Format: '):
                    input_event_format = line[8:].split(', ')
                    line = tcd_config['ssa_events_format']
                elif line.startswith('Dialogue: '):
                    if not input_event_format:
                        raise ValueError(f'Events format not found in {ifn}')

                    try:
                        msg = Message(line, input_event_format)
                        msg = func(msg)

                        if msg is None:
                            raise EmptyLineError()

                        line = msg.to_str(output_event_format)
                    except EmptyLineError:
                        continue

            f_out.write(line + '\n')

    if replace:
        os.rename(ofn, ifn)


def convert_file(file: str, style: SubtitlesStyle = None):
    print(f'Converting {file}')
    return convert(file, style=style, func=convert_msg)


def cut_subtitles(segment):
    if not os.path.exists(segment.stream.subtitles_path):
        return

    cache_key = f'cuts-{segment.hash}'
    cut_hash = md5(str(segment.cuts).encode('utf-8')).hexdigest()

    if len(segment.cuts) == 0:
        if cache_key in cache:
            print(f'Removing cut subtitles of segment {segment.hash}')
            os.unlink(segment.cut_subtitles_path)
            cache.remove(cache_key)
        return

    def rebase_msg(msg):
        time = msg.start.time()
        time = 3600 * time.hour + 60 * time.minute + time.second

        # Drop all cut messages
        for cut in segment.cuts:
            if cut.value <= time <= cut.value + cut.duration:
                raise EmptyLineError()

        # Rebase messages after cuts
        delta = timedelta(seconds=sum([cut.duration
                                       for cut in segment.cuts
                                       if cut.value <= time]))
        msg.start -= delta
        msg.end -= delta

        return msg

    if cache.get(cache_key) != cut_hash:
        print(f'Cutting subtitles for segment {segment.hash}')

        convert(segment.stream.subtitles_path,
                segment.subtitles_path,
                style=segment.stream.subtitles_style,
                func=rebase_msg)

        cache.set(cache_key, cut_hash)
