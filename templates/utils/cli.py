"""Usage:
  cli segment (get | set | update) <stream> [<segment>] [options]
  cli segment new <stream> [options]

Options:
  --dry-run             Do not change anything, just print the result.

Segment options:
  --youtube <id>        ID of YouTube video that can be used as a source for
                        this segment. Warning: full URLs are not supported!
  --offset [[H:]MM:]SS  Offset of this segment relative to the start of
                        original stream.
"""

import sys

from docopt import docopt

from ..data.streams import streams, Segment
from ..data.timecodes import Timecode


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    if args['segment']:
        options = (('youtube', str),
                   ('offset', Timecode))

        stream_id = args['<stream>']
        segment_id = int(args.get('<segment>') or 0)

        if args['<stream>'] not in streams:
            print(f'Stream {stream_id} does not exist')
            sys.exit(1)
        
        stream = streams[stream_id]

        if args['get'] or args['update']:
            if len(stream) - 1 < segment_id:
                print(f'Stream {stream_id} does not have segment {segment_id}')
                sys.exit(1)

            segment = stream[segment_id]
            segment.fallback = False

        if args['update']:
            for key, type in options:
                if args.get(f'--{key}') is not None:
                    setattr(segment, key, type(args[f'--{key}']))

        if args['new'] or args['set']:
            kwargs = dict()

            for key, type in options:
                if args.get(f'--{key}') is not None:
                    kwargs[key] = type(args[f'--{key}'])

            segment = Segment(stream, **kwargs)
            segment.fallback = False

            if args['set']:
                stream[segment_id] = segment
            else:
                stream.append(segment)

        if args['get']:
            print(segment)
        elif args['--dry-run']:
            print(stream)
        else:
            streams.save()


if __name__ == '__main__':
    main()
