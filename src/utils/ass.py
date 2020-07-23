import os
from hashlib import md5
from datetime import timedelta, datetime as dtt

from ..data.cache import cache
from ..data.config import tcd_config


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
    def username(self):
        return self.fields['Text'].split(': ', 1)[0]

    @username.setter
    def username(self, value):
        self.fields['Text'] = f'{value}: {self.text}'

    @property
    def text(self):
        return self.fields['Text'].split(': ', 1)[1]

    @text.setter
    def text(self, value):
        self.fields['Text'] = f'{self.username}: {value}'

    def __init__(self, line, event_format):
        self.format = event_format

        msg = line[10:].split(', ', len(event_format) - 1)
        self.fields = dict(zip(event_format, msg))

        try:
            self.text
        except:
            raise EmptyLineError()

    def to_str(self, event_format=None):
        if not event_format:
            event_format = self.format

        return 'Dialogue: ' + ', '.join(
            [self.fields[field] for field in event_format])


def convert(input_file, output_file=None, func=lambda msg: msg):
    if output_file is None:
        output_file = f'{input_file}.tmp'
        replace = True
    else:
        replace = False

    event_section = False
    input_event_format = None
    output_event_format = tcd_config['ssa_events_format'][8:].split(', ')

    with open(input_file, 'r') as f_in, open(output_file, 'w') as f_out:
        for line in f_in:
            line = line.strip()

            if line.startswith('[Events]'):
                event_section = True

            if event_section and line.startswith('Format: '):
                input_event_format = line[8:].split(', ')
                line = tcd_config['ssa_events_format']

            if line.startswith('Dialogue: '):
                if not input_event_format:
                    raise ValueError(f'Events format not found in {input_file}')

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
        os.rename(output_file, input_file)


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

    def convert_msg(msg):
        time = msg.time.time()
        time = 3600 * time.hour + 60 * time.minute + time.second

        # Drop all cut messages
        for cut in segment.cuts:
            if cut.value <= time <= cut.value + cut.duration:
                raise EmptyLineError()

        # Rebase messages after cuts
        msg.time -= timedelta(seconds=sum([cut.duration
                                           for cut in segment.cuts
                                           if cut.value <= time]))

        return msg

    if cache.get(cache_key) != cut_hash:
        print(f'Cutting subtitles for segment {segment.hash}')

        convert(segment.stream.subtitles_path,
                segment.subtitles_path,
                func=convert_msg)

        cache.set(cache_key, cut_hash)
