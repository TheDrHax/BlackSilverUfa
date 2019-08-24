"""Usage:
  cli segment (get | set | update) <stream> [<segment>] [options]
  cli segment add <stream> [options]

Options:
  --dry-run         Do not change anything, just print the result.

Segment options:
  --youtube <id>    ID of YouTube video that can be used as a source for
                    this segment. Warning: full URLs are not supported!
  --offset <t>      Offset of this segment relative to the start of
                    original stream. [default: 0]
"""

import sys
import itertools

from docopt import docopt
from sortedcontainers import SortedList

from ..data.streams import streams, Segment, Stream
from ..data.games import games
from ..data.timecodes import Timecode


flat = itertools.chain.from_iterable


def refs_coverage(stream, segment):
    refs = SortedList(flat([seg.references for seg in stream]),
                      key=lambda x: x.abs_start)

    left, covered, right = [], [], []

    for ref in refs:
        seg_start = Timecode(segment.offset)
        seg_end = segment.duration + Timecode(segment.offset)
        ref_start = ref.abs_start
        ref_end = ref.abs_end

        # Find percentage of covered timeline
        coverage = 0
        if seg_end > ref_start and seg_start < ref_end:
            coverage = int(min(ref_end, seg_end) -
                            max(ref_start, seg_start))
            coverage *= 100
            coverage //= int(ref_end - ref_start)

        if coverage > 0:
            print(f'Covered {coverage}% of `{ref.game.id}` - `{ref.name}`')

        if coverage >= 50:
            covered.append(ref)
        elif len(covered) == 0:
            left.append(ref)
        else:
            right.append(ref)
        
    return left, covered, right


def cmd_add(stream, segment_kwargs):
    tmp_stream = Stream([], stream.twitch)
    segment = Segment(tmp_stream, **segment_kwargs)
    segment.fallback = False

    left, covered, right = refs_coverage(stream, segment)

    if len(covered) == 0:
        return

    segment.stream = stream
    [setattr(ref, 'parent', segment) for ref in covered]

    # split original segment if new one covered only refs in the middle
    left_segments = set(ref.parent for ref in left)
    to_split = set(ref.parent for ref in right if ref.parent in left_segments)
    to_split_refs = flat([s.references for s in to_split])

    if len(to_split) > 0:
        right_segment = Segment(stream, offset=segment.abs_end)
        [setattr(ref, 'parent', right_segment) for ref in right if ref in to_split_refs]

    [stream.remove(s) for s in list(stream) if len(s.references) == 0]

    for s in stream:
        if s.references[0].start:
            setattr(s, 'offset', s.references[0].start)
            setattr(s.references[0], 'start', None)


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    if args['segment']:
        stream_id = args['<stream>']
        segment_id = int(args.get('<segment>') or 0)

        if stream_id not in streams:
            print(f'Stream {stream_id} does not exist')
            sys.exit(1)

        stream = streams[stream_id]

        if args['get'] or args['update'] or args['set']:
            if len(stream) - 1 < segment_id:
                print(f'Stream {stream_id} does not have segment {segment_id}')
                sys.exit(1)

            segment = stream[segment_id]
            segment.fallback = False

        if args['get']:
            print(segment)
            sys.exit(0)

        # Parse segment options
        if args['update'] or args['set'] or args['add']:
            options = (('youtube', str), ('offset', Timecode))
            segment_kwargs = dict()

            for key, type in options:
                if args.get(f'--{key}') is not None:
                    segment_kwargs[key] = type(args[f'--{key}'])

        # Update existing segment's options
        if args['update'] or args['set']:
            for key, value in segment_kwargs.items():
                if value is not None or args['set']:
                    setattr(segment, key, value)

        if args['add']:
            cmd_add(stream, segment_kwargs)

        if args['--dry-run']:
            print(stream)
        else:
            games.save()
            streams.save()


if __name__ == '__main__':
    main()
