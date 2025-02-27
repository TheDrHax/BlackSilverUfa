"""Usage: source_cuts <log> <video>..."""

import sys

from math import floor
from parse import compile
from docopt import docopt
from typing import List, Tuple, Union
from subprocess import Popen, PIPE
from twitch_utils.clip import Clip
from twitch_utils.concat import Timeline
from tempfile import NamedTemporaryFile

from ..data.timecodes import Timecodes, T


DP_PKT_DURATION = 2750
PARSE_TIMINGS = compile('Clip {} started at {ts:g} with offset {offset:g}{}')


def detect_disconnect_protection(
        videos: List[str],
        start: Union[float, None] = None,
        end: Union[float, None] = None) -> List[Tuple[float, float]]:
    ffcmd = ['ffprobe',
             '-v', 'error',
             '-select_streams', 'v:0',
             '-show_entries', 'packet=pts_time,duration',
             '-of', 'csv']

    if None not in [start, end]:
        ffcmd += ['-read_intervals', f'{start}%{end}']

    if len(videos) > 1:
        if False in [f.endswith('.ts') for f in videos]:
            raise Exception('ERROR: When multiple clips are provided, they '
                            'all must be in MPEG-TS format.')
        
        clips = []
        for f in videos:
            try:
                clips.append(Clip(f))
            except Exception:
                pass

        timeline = Timeline(clips)
        concat_map = NamedTemporaryFile(delete=True, suffix='.txt')
        timeline.render(concat_map.name, 'txt', force=True)
        ffcmd += ['-safe', '0', '-f', 'concat', concat_map.name]
    else:
        ffcmd += videos

    ffproc = Popen(ffcmd, stdout=PIPE, stderr=PIPE)

    ranges = []
    ts = None
    current_range = None
    length = 0

    for line in ffproc.stdout:
        line = line.decode()

        if not line.startswith('packet,'):
            continue

        parts = line.strip().split(',')
        ts = float(parts[1])
        duration = int(parts[2])

        if not current_range:
            if duration >= DP_PKT_DURATION:
                current_range = ts
                length = 1
                # print(f'Start: {ts}', file=sys.stderr)
        else:
            if duration < DP_PKT_DURATION:
                if length > 1:
                    ranges.append((current_range, ts))
                current_range = None
                # print(f'End: {ts}', file=sys.stderr)
            else:
                length += 1

    if current_range:
        ranges.append((current_range, ts))
        current_range = None

    ffproc.terminate()
    ffproc.wait()

    if ffproc.returncode != 0:
        raise Exception('ffprobe exited with non-zero code '
                        f'(code: {ffproc.returncode})')

    return ranges


def parse_log_timings(log_path: str) -> List[Tuple[float, float, float]]:
    timeline = []
    lost = []

    with open(log_path, 'r') as log:
        for line in log:
            parsed = PARSE_TIMINGS.parse(line)

            if parsed:
                timeline.append((parsed['ts'], parsed['offset']))

    timeline = sorted(timeline, key=lambda x: x)
    start = timeline[0][1]

    for i in range(len(timeline) - 1):
        ts1, offset1 = timeline[i]
        ts2, offset2 = timeline[i+1]

        diff = (ts2 - ts1) - (offset2 - offset1)

        if diff > 4:  # two segments
            lost.append((offset1 - start, offset2 - start, diff))

    return lost


def get_source_cuts(videos: List[str], log: str) -> Timecodes:
    ranges = Timecodes()

    for start, end, diff in parse_log_timings(log):
        start = end - 300
        dp = detect_disconnect_protection(videos, start, end)

        if len(dp) == 0:
            print(f'WARN: Cut must be in {T+int(start)}~{T+int(end)}, but '
                   'disconnect protection screen can not be found. '
                  f'Lost {diff}s')

        for s, e in dp:
            t = T + floor(s)
            t.duration = T + round(diff / len(dp))
            ranges.add(t)

    return ranges


def main(argv=None):
    args = docopt(__doc__, argv=argv)
    ts = get_source_cuts(args['<video>'], args['<log>'])
    print(','.join(f'{t.start}~{t.end}' for t in ts))


if __name__ == '__main__':
    main()
