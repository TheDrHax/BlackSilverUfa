"""Usage: source_cuts <video>"""

import av
import sys
import uuid

from av.container import InputContainer
from datetime import datetime
from docopt import docopt
from ..data.timecodes import Timecode, Timecodes
# from twitch_utils.concat import Timeline
# from twitch_utils.clip import Clip
# from tempfile import NamedTemporaryFile


TS_UUID = uuid.UUID("0aecffe7-5272-4e2f-a62f-d19cd61a93b5").bytes
# SM_UUID = uuid.UUID("ca60e71c-6a8b-4388-a377-151df7bf8ac2").bytes
# ERM_UUID = uuid.UUID("f1fbc1d5-101e-4fb5-a61e-b8ce3c07b8c0").bytes


epoch = datetime.fromtimestamp(0)


def iterate_packets(container: InputContainer, start: float, end = -1.0, key=False):
    stream = container.streams.video[0]
    stream.codec_context.skip_frame = 'NONKEY' if key else 'DEFAULT'

    assert stream.time_base

    start = int(start / stream.time_base)
    end = int(end / stream.time_base)

    container.seek(start, stream=stream, any_frame=not key, backward=True)

    for packet in container.demux(stream):
        if not packet.pts or (end > start and packet.pts > end):
            return

        yield packet


def extract_time(container: InputContainer, timestamp: float):
    for packet in iterate_packets(container, timestamp):
        for frame in packet.decode():
            at = None

            for sd in frame.side_data:
                if sd.type.name != 'SEI_UNREGISTERED':
                    continue

                raw = bytes(sd)
                uuid_bytes = raw[:16]
                payload = raw[16:]

                if uuid_bytes != TS_UUID:
                    continue

                at = datetime.strptime(payload[3:27].decode(), '%Y-%m-%dT%H:%M:%S.%fZ')

            if not at:
                continue

            assert frame.pts and frame.time_base
            t = float(frame.pts * frame.time_base)

            return t, at

    return None, None


def binary_search(container, start, end):
    timestamp = start + (end - start) / 2

    ts, ats = extract_time(container, start)
    t, at = extract_time(container, timestamp)
    te, ate = extract_time(container, end)

    d1 = (at - ats).total_seconds() - (t - ts)
    d2 = (ate - at).total_seconds() - (te - t)

    left, right = [], []

    if abs(d1) > 0.1:
        if t == end:
            left = [(start, end, d1)]
        else:
            left = binary_search(container, start, t)
    
    if abs(d2) > 0.1:
        if t == start:
            right = [(start, end, d2 - d1)]
        else:
            right = binary_search(container, t, end)

    return [*left, *right]


def find_disconnect_protection(container: InputContainer, start, end):
    prev_pts = -1

    for packet in iterate_packets(container, start, end):
        if prev_pts < 0:
            prev_pts = packet.pts

        assert packet.pts and packet.time_base and packet.duration

        if prev_pts * packet.time_base > end:
            return None

        if packet.duration > 50000:
            return float(prev_pts * packet.time_base)

        prev_pts = packet.pts

    return None


def get_source_cuts(container: InputContainer) -> Timecodes:
    video = container.streams.video[0]
    duration = video.duration * video.time_base

    offset, date_start = extract_time(container, 0)
    assert offset

    end = None
    i = 0

    while not end:
        end, date_end = extract_time(container, duration - 60 * i)
        i += 1

    delta = (date_end - date_start).total_seconds() - (end - offset)

    if delta < 1:
        return Timecodes()

    print(f'Lost {delta} seconds, performing binary search', file=sys.stderr)

    res = binary_search(container, offset, end - 1)

    print(f'Found {len(res)} range(s): {res}', file=sys.stderr)

    result = Timecodes()

    for start, end, delta in res:
        print(f'Looking for cut in {start}~{end} (lost {delta})',
              file=sys.stderr)

        range = Timecode(start, end)
        t = find_disconnect_protection(container, start, end)

        if t is None:
            print(f'WARN: Cut must be in {range.to_str()}, but '
                   'disconnect protection screen can not be found. '
                   'Using approximation.',
                  file=sys.stderr)
            
            t = start + (end - start) / 2

        t = Timecode(round(t - offset), round(t - offset + delta))
        result.add(t)

    return result


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    # if len(args['<video>']) > 1:
    #     tl = Timeline([Clip(c) for c in args['<video>']])
    #     concat_map = NamedTemporaryFile(delete=True, suffix='.txt')
    #     tl.render(concat_map.name, 'txt', force=True)
    #     container = av.open(concat_map.name, format='concat', options={'safe': '0'})
    # else:
    #     container = av.open(args['<video>'][0])

    container = av.open(args['<video>'])

    assert isinstance(container, InputContainer)

    format = container.format.name
    if format == 'mpegts':
        print('MPEG-TS is not supported', file=sys.stderr)
        container.close()
        sys.exit(1)

    ts = get_source_cuts(container)
    print(','.join(f'{t.to_str(True)}' for t in ts))

    container.close()

if __name__ == '__main__':
    main()
