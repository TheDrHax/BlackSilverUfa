import json

from ..data.games import games
from ..data.streams import streams
from ..data.timecodes import Timecodes, timecodes


if __name__ == '__main__':
    timecodes.save()
    games.save()
    streams.save()