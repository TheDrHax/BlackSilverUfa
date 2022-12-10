from datetime import datetime
import clipboard
import requests
from time import sleep
from tcd.twitch import Channel
from ..data.timecodes import T


STATE = 'https://red.thedrhax.pw/blackufa/twitch'


class TimecodeHelper:
    offset = 5  # Constant for low latency streamlink + MPV without cache

    @staticmethod
    def time():
        """Get current time as Timecode."""
        return T + str(datetime.time(datetime.now())).split('.')[0]

    def __init__(self, start):
        self.start = T + start

    def __call__(self):
        t = self.time() - self.start - T(self.offset)
        if t < 0:
            t += '24:00:00'
        clipboard.copy(str(t))
        return t

    get = __call__


c = Channel('blackufa')
t = TimecodeHelper('0:00:00')


def stream_state():
    return requests.get(STATE).json()


def wait_for_stream():
    a = stream_state()
    while not a['active']:
        sleep(1)
        a = stream_state()
    return a


def init():
    global t
    stream = wait_for_stream()
    print(f'VOD: {stream["vod"]}')
    print(f'Start: {stream["time"]}')
    t = TimecodeHelper(stream['time'])


print('Objects: t (TimecodeHelper), c (Channel)')
print('Methods: init (wait for stream and configure TimecodeHelper)')
