import os
from ..data.cache import cache
from hashlib import md5
from datetime import timedelta, datetime as dtt


class EmptyLineError(Exception):
    pass


class Message:
    @staticmethod
    def ptime(t):
        return dtt.strptime(t, '%H:%M:%S.%f')
    
    @staticmethod
    def ftime(t):
        return dtt.strftime(t, '%-H:%M:%S.%f')[:-4]

    def __init__(self, line):
        msg = line.split(', ', 9)

        self.msg = msg
        try:
            self.username, self.text = msg[9].split(': ', 1)
        except:
            raise EmptyLineError()
            
        self.time = self.ptime(msg[1])
        self.duration = self.ptime(msg[2]) - self.time
    
    def __str__(self):
        self.msg[1] = self.ftime(self.time)
        self.msg[2] = self.ftime(self.time + self.duration)
        self.msg[9] = f'{self.username}: {self.text}'
        return ', '.join(self.msg)


def convert(input_file, output_file=None, func=lambda msg: msg):
    if output_file is None:
        output_file = f'{input_file}.tmp'
        replace = True
    else:
        replace = False

    with open(input_file, 'r') as f_in, open(output_file, 'w') as f_out:
        for line in f_in:
            try:
                if line.startswith('Dialogue: '):
                    msg = Message(line.strip())
                    line = str(func(msg)) + '\n'

                f_out.write(line)
            except EmptyLineError:
                continue

    if replace:
        os.rename(output_file, input_file)


def cut_subtitles(segment):
    if not os.path.exists(segment.stream.subtitles_path):
        return

    cache_key = f'cuts-{segment.hash}'
    cut_hash = md5(str(segment.cuts).encode('utf-8')).hexdigest()

    if not segment.cuts:
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
