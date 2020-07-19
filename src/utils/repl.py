import requests
from time import sleep
from tcd.twitch import Channel
from ..data.timecodes import Timecode, TimecodeHelper


STATE = 'https://red.thedrhax.pw/blackufa/twitch'

c = Channel('blackufa')
v = lambda: c.videos().__next__()
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