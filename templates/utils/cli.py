"""Usage:
  cli [options] segment (get | set | update) <stream> [<segment>] [--youtube <id>] [--offset <t>]
  cli [options] segment add <stream> --youtube <id> [--offset <t>] [--end <t>]
  cli [options] segment add <stream> --end <t> [--offset <t>]
  cli [options] segment match --youtube <id> [--all] [--directory <path>]

Commands:
  segment
    get         Output matching segment in JSON format.
    set         Recreate existing segment with following parameters.
    update      Update specified fields of existing segment.
    add         Create a new segment with known stream ID and offset.
    match       Try to find matching stream and offset of provided video.

Options:
  --dry-run           Do not change anything, just print the result.
  --commit            Create a new commit in current branch. All changes in
                      data/{games,streams}.json will be committed.
                      WARNING: Repository index will not be cleared!

Segment options:
  --youtube <id>      ID of YouTube video that can be used as a source for
                      this segment. Warning: full URLs are not supported!
  --offset <t>        Offset of this segment relative to the start of
                      original stream. [default: 0]
  --end <t>           Forced absolute timecode of segment's ending.

Segment matching options:
  --all               Check all streams with at least one unofficial or
                      empty source. Streams without fallbacks will be skipped.
  --directory <path>  Use a local directory as a fallback source for
                      faster matching of streams. Directory must contain
                      original stream recordings. Expected filename format
                      is '{twitch_id}.mp4'.
"""


import os
import sys
import itertools

from git import Repo
from docopt import docopt
from subprocess import run, PIPE
from sortedcontainers import SortedList
from twitch_utils.offset import Clip, find_offset

from ..data.streams import streams, Segment, Stream, STREAMS_JSON
from ..data.games import games, GAMES_JSON
from ..data.timecodes import Timecode


flat = itertools.chain.from_iterable


def refs_coverage(stream, segment):
    refs = SortedList(flat([seg.references for seg in stream]),
                      key=lambda x: x.abs_start)

    left, covered, right = [], [], []

    for ref in refs:
        seg_start = segment.abs_start
        seg_end = segment.abs_end
        ref_start = ref.abs_start
        ref_end = ref.abs_end

        # Find percentage of covered timeline
        coverage = 0
        if seg_end > ref_start and seg_start < ref_end:
            coverage = int(min(ref_end, seg_end) - max(ref_start, seg_start))
            coverage *= 100
            coverage //= int(ref_end - ref_start)

        ref._coverage = coverage

        if coverage > 0:
            print(f'Covered {coverage}% of `{ref.game.id}` - `{ref.name}`',
                  file=sys.stderr)

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

    # Disable all fallbacks
    [setattr(s, 'fallback', False) for s in stream]
    segment.fallback = False

    left, covered, right = refs_coverage(stream, segment)

    if len(covered) == 0:
        raise Exception('Video does not cover any segment references')

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

    covered[0].start = None
    for s in stream:
        if s.references[0].start:
            setattr(s, 'offset', s.references[0].start)
            setattr(s.references[0], 'start', None)

    return segment

def cmd_match(segment_kwargs, directory=None, match_all=False):
    def original(segment):
        if directory:
            filename = f'{directory}{os.path.sep}{segment.twitch}.mp4'
        else:
            filename = None

        if filename and os.path.exists(filename):
            return filename

        if segment.direct and not segment.offset:
            return segment.direct

        return None

    def can_match(segment):
        if segment.youtube and segment.official != False and not match_all:
            return False

        return original(segment) is not None

    candidates = sorted([s for s in streams.segments if can_match(s)],
                        key=lambda s: 1 if s.official == False else 0)

    try:
        print(f'Preparing template...', file=sys.stderr)
        youtube_source = ytdl_best_source(segment_kwargs['youtube'])
        template = Clip(youtube_source, ar=1000).slice(300, 300)[0]
    except:
        print(f'Falling back to bestaudio...', file=sys.stderr)
        youtube_source = ytdl_best_source(segment_kwargs['youtube'], 'bestaudio')
        template = Clip(youtube_source, ar=1000).slice(300, 300)[0]

    checked_streams = set()
    matching_stream = None
    video_offset = None

    for segment in candidates:
        if segment.stream.twitch in checked_streams:
            continue
        else:
            checked_streams.add(segment.stream.twitch)

        path = original(segment)
        print(f'Checking stream {segment.twitch} (path: {path})',
              file=sys.stderr)

        try:
            offset, score = find_offset(template, Clip(path, ar=1000), min_score=10)
        except Exception:
            continue

        offset -= 300

        if score > 0:
            matching_stream = segment.stream
            video_offset = Timecode(round(offset))
            break

    if matching_stream is None:
        raise Exception('Video does not match any streams')

    segment_kwargs['offset'] = video_offset
    segment = cmd_add(matching_stream, segment_kwargs)
    return matching_stream, segment


def ytdl_best_source(video_id, quality='best'):
    p = run(['youtube-dl', '-gf', quality, video_id], stdout=PIPE)

    if p.returncode != 0:
        raise RuntimeError(f'youtube-dl exited with non-zero code {p.returncode}')

    return p.stdout.decode('utf-8').strip()


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    if args['segment']:
        stream_id = args['<stream>']
        segment_id = int(args.get('<segment>') or 0)

        if not args['match']:
            if stream_id not in streams:
                raise Exception(f'Stream {stream_id} does not exist')

            stream = streams[stream_id]

        if not args['add'] and not args['match']:
            if len(stream) - 1 < segment_id:
                raise Exception(f'Segment {stream_id}.{segment_id} does not exist')

            segment = stream[segment_id]
            segment.fallback = False

        if args['get']:
            print(segment)
            return

        # Parse segment options
        options = (('youtube', str), ('offset', Timecode), ('end', Timecode))
        segment_kwargs = dict()

        for key, type in options:
            if args.get(f'--{key}') is not None:
                segment_kwargs[key] = type(args[f'--{key}'])

        commit_msg = None

        # Update existing segment's options
        if args['update'] or args['set']:
            for key, value in segment_kwargs.items():
                if value is not None or args['set']:
                    setattr(segment, key, value)

            commit_msg = f'Изменение сегмента {segment.hash}'

        if args['add']:
            segment = cmd_add(stream, segment_kwargs)

        if args['match']:
            stream, segment = cmd_match(segment_kwargs,
                                        directory=args['--directory'],
                                        match_all=args['--all'])

        if args['add'] or args['match']:
            if len(stream) == 1:
                commit_title = f'Запись стрима {stream.twitch}'
            else:
                commit_title = f'Запись сегмента {segment.hash}'

            commit_msg = '\n'.join(flat([
                [commit_title, ''],
                [f'* {ref.game.name} — {ref.name} [{ref._coverage}%]'
                 for ref in segment.references]
            ]))

        if not args['--dry-run']:
            games.save()
            streams.save()

            if commit_msg and args['--commit']:
                repo = Repo('.')
                repo.index.add([STREAMS_JSON, GAMES_JSON])
                repo.index.commit(commit_msg)

        print(stream)


if __name__ == '__main__':
    main()
