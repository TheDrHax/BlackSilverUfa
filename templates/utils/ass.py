import os
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