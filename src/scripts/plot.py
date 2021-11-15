"""Usage: plot <stream> <keyword>..."""

import re

import plotly.graph_objects as go
from docopt import docopt

from ..data.streams import streams
from ..data.timecodes import Timecode
from ..utils.ass import SubtitlesReader
from .converter import unpack_line_breaks, unpack_emotes


STEP = 10


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    r = SubtitlesReader(streams[args['<stream>']].subtitles_path)
    matcher = re.compile(f'({"|".join(args["<keyword>"])})')
    data = []

    for event in r.events():
        text = unpack_line_breaks(event.text)
        text = unpack_emotes(text)

        start = int(event.start // STEP)

        for i in range(start - len(data) + 1):
            data.append(0)

        data[start] += len(matcher.findall(text))

    r.close()

    x = [str(Timecode(x * STEP)) for x in range(len(data))]
    y = data

    fig = go.Figure()
    fig.add_trace(go.Scatter(x=x, y=data))
    fig.show()


if __name__ == '__main__':
    main()
