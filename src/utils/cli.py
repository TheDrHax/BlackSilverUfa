"""Usage:
  cli [options] stream add <stream>
  cli [options] segment (get | set | update) <stream> [<segment>] [--youtube <id> | --direct <url>] [--offset <t>]
  cli [options] segment add <stream> (--youtube <id> | --direct <url>) [--offset <t>] [--end <t>] [--duration <t>]
  cli [options] segment match (--youtube <id> | --direct <url>) [--all] [--directory <path>] [--fail-if-cut]
  cli [options] segment cuts <stream> [<segment>] (--youtube <id> | --direct <url>) [--directory <path>]
  cli [options] game add <game> <category> <name>
  cli [options] ref add <game> <stream> [<segment>] --name <name> [--start <t>]
  cli [options] copyright mute <stream> <input> <output>

Commands:
  stream
    add         Create a new empty stream in streams.json.

  segment
    get         Output matching segment in JSON format.
    set         Recreate existing segment with following parameters.
    update      Update specified fields of existing segment.
    add         Create a new segment with known stream ID and offset.
    match       Try to find matching stream and offset of provided video.
    cuts        Try to detect cuts in YouTube video by comparing it to the
                fallback source.

  game
    add         Create a new game without streams.

  ref
    add         Create a new link between game and segment.

  copyright
    mute        Uses ffmpeg to mute all copyrighted segments in the <input>
                video. Time ranges must be listed in <stream>'s timecodes
                under the top-level key 'Проблемы с правообладателями'.

Options:
  --dry-run           Do not change anything, just print the result.

Video sources:
  --youtube <id>      ID of YouTube video that can be used as a source for
                      this segment. Warning: full URLs are not supported!
  --direct <url>      URL or path of the video.

Segment options:
  --offset <t>        Offset of this segment relative to the start of
                      original stream. [default: 0]
  --duration <t>      Set video duration for more precise segment splitting.
  --end <t>           Forced absolute timecode of segment's ending.
  --unofficial        Mark new segment as unofficial.
  --commit            Create a new commit in current branch. All changes in
                      data/{games,streams}.json will be committed.
                      WARNING: Repository index will not be cleared!

Ref options:
  --name <name>       Name of the segment reference.
  --start <t>         Offset of segment reference from the start of the segment.
                      First ref's offset is always ignored. [default: 0]

Segment matching options:
  --all               Check all streams with at least one unofficial or
                      empty source. Streams without fallbacks will be skipped.
  --directory <path>  Use a local directory as a fallback source for
                      faster matching of streams. Directory must contain
                      original stream recordings. Expected filename format
                      is '{twitch_id}.mp4'.
  --fail-if-cut       Stop if input video has an inconsistent offset. For
                      example, if some parts in the middle of the video were
                      removed, its ending will be closer to the beginning.
                      This allows exact matching of videos to preserve some
                      fields of a segment (offset[s], cuts).
"""


import os
import sys
import itertools

from git import Repo
from docopt import docopt
from subprocess import run, PIPE
from sortedcontainers import SortedList
from twitch_utils.offset import Clip, find_offset

from ..data.streams import (StreamType, SubReference, streams, Stream,
                            Segment, SegmentReference)
from ..data.games import games, Game
from ..data.categories import categories
from ..data.timecodes import timecodes, Timecode, Timecodes
from ..data.fallback import fallback


flat = itertools.chain.from_iterable


def refs_coverage(stream, segment):
    subrefs = SortedList([subref
                          for seg in stream
                          for ref in seg.references
                          for subref in ref.subrefs],
                         key=lambda x: x.abs_start)

    seg_start = segment.abs_start
    seg_end = segment.abs_end

    for subref in subrefs:
        ref_start = subref.abs_start
        ref_end = subref.abs_end

        # Find percentage of covered timeline
        coverage = 0
        if seg_end > ref_start and seg_start < ref_end:
            coverage = int(min(ref_end, seg_end) - max(ref_start, seg_start))
            coverage *= 100
            coverage //= int(ref_end - ref_start)

        subref._coverage = coverage

    covered, partial, uncovered = [], [], []

    for segment in stream:
        for ref in segment.references:
            cov = sum(1 for subref in ref.subrefs if subref._coverage >= 50)
            total = len(ref.subrefs)
            ref._coverage = cov, total

            if cov == 0:
                uncovered.append(ref)
            elif cov == total:
                covered.append(ref)
            else:
                partial.append(ref)

    return covered, partial, uncovered


def cmd_add(stream, segment_kwargs):
    tmp_stream = Stream(data=[], key=stream.twitch)
    segment = Segment(stream=tmp_stream, **segment_kwargs)

    covered, partial, uncovered = refs_coverage(stream, segment)

    for ref in flat([covered, partial, uncovered]):
        cov, total = ref._coverage
        print(f'Covered {cov}/{total} subrefs '
              f'of `{ref.game.id}` - `{ref.name}`',
              file=sys.stderr)
        for subref in ref.subrefs:
            print(f'  {subref._coverage}% of `{subref.name}`',
                  file=sys.stderr)

    if len(covered) == 0 and len(partial) == 0:
        raise Exception('Video does not cover any subrefs')

    # add segment to stream
    segment.stream = stream

    # move fully covered refs into new segment
    [setattr(ref, 'parent', segment) for ref in covered]

    # split partially covered refs by subrefs
    for ref in partial:
        # find subrefs that are on the left and right of the covered ones
        left, center, right = [], [], []
        for subref in ref.subrefs:
            subref.hidden = False
            if subref._coverage < 50:
                if len(center) == 0:
                    left.append(subref)
                else:
                    right.append(subref)
            else:
                center.append(subref)

        # create ref for left subrefs
        if len(left) > 0:
            left_ref = SegmentReference(game=ref.game,
                                        parent=ref.parent,
                                        subrefs=left)
            index = ref.game.streams.index(ref)
            ref.game.streams.insert(index, left_ref)

        # create ref for right subrefs
        if len(right) > 0:
            right_ref = SegmentReference(game=ref.game,
                                         parent=ref.parent,
                                         subrefs=right)
            index = ref.game.streams.index(ref)
            ref.game.streams.insert(index + 1, right_ref)

        # move now fully covered ref to new segment
        ref.parent = segment

    # remove empty segments
    [stream.remove(s) for s in list(stream) if len(s.references) == 0]

    # use start of first ref as a hint for future segment matches
    segment.references[0].start = Timecode(0)
    for s in stream:
        if s.references[0].start != 0 and not s.playable:
            setattr(s, 'offset', s.references[0].start)
            setattr(s.references[0], 'start', 0)

    return segment


def original_video(segment, directory):
    # Try to find file in the specified directory
    if directory:
        filename = os.path.join(directory, f'{segment.twitch}.mp4')

        if os.path.exists(filename):
            return filename

    if not directory:
        directory = fallback.directory

    # Get path or URL from fallback
    if f'{segment.twitch}.mp4' in fallback:
        url = fallback.url(f'{segment.twitch}.mp4')
        filename = url.replace(fallback.prefix, directory)

        if os.path.exists(filename):
            return filename
        else:
            return url

    # Get path from direct URL
    if segment.direct and segment.direct.startswith(fallback.prefix):
        filename = segment.direct.replace(fallback.prefix, directory)

        if os.path.exists(filename):
            return filename
        else:
            return segment.direct

    return None


def match_candidates(segment_kwargs, directory=None, match_all=False):
    for s in streams.segments:
        if not original_video(s, directory):
            continue

        if s.youtube and s.official and not match_all:
            continue

        if not s.official and segment_kwargs.get('official') is False:
            print(f'Skipping segment {s.hash} '
                  '(both videos are unofficial)', file=sys.stderr)
            continue

        tmp_stream = Stream(data=[], key=s.stream.twitch)
        tmp_segment = Segment(stream=tmp_stream, **segment_kwargs)

        subrefs = SortedList([subref
                              for ref in s.references
                              for subref in ref.subrefs],
                             key=lambda x: x.abs_start)

        for subref in subrefs:
            tmp_segment.offset = subref.abs_start

            covered, partial, _ = refs_coverage(s.stream, tmp_segment)

            c_refs = SortedList([subref
                                 for ref in flat([covered, partial])
                                 for subref in ref.subrefs
                                 if subref._coverage >= 50],
                                key=lambda x: x.abs_start)

            if len(c_refs) == 0:
                print(f'Skipping segment {s.hash} '
                      '(would not cover any subrefs)', file=sys.stderr)
                continue

            time_range = Timecode(c_refs[0].abs_start)
            time_range.duration = int(c_refs[-1].abs_end - c_refs[0].abs_start)
            yield s, time_range


def ytdl_video(video_id):
    try:
        print(f'Retrieving video from YouTube...', file=sys.stderr)
        youtube_source = ytdl_best_source(video_id)
        video = Clip(youtube_source, ar=1000)
        video.slice(0, 1)
    except:
        print(f'Falling back to bestaudio...', file=sys.stderr)
        youtube_source = ytdl_best_source(video_id, 'bestaudio')
        video = Clip(youtube_source, ar=1000)
        video.slice(0, 1)
    return video


def cmd_match(segment_kwargs, directory=None, match_all=False, fail_if_cut=False):
    if 'youtube' in segment_kwargs:
        dupes = [s for s in streams.segments
                 if s.youtube == segment_kwargs['youtube']]

        if len(dupes) != 0:
            print(f'Error: Video is already assigned to segment {dupes[0].hash}',
                  file=sys.stderr)
            sys.exit(2)

        video = ytdl_video(segment_kwargs['youtube'])
    elif 'direct' in segment_kwargs:
        video = Clip(segment_kwargs['direct'], ar=1000)

    segment_kwargs['duration'] = video.duration

    candidates = sorted(
        match_candidates(segment_kwargs, directory, match_all),
        key=lambda s: abs(int(s[1].duration) - video.duration))

    if len(candidates) == 0:
        print('Error: No candidates found', file=sys.stderr)
        sys.exit(2)

    print(f'Preparing template...', file=sys.stderr)
    template = video.slice(300, 300)[0]

    original = None
    matching_segment = None
    video_offset = None

    for segment, t_range in candidates:
        path = original_video(segment, directory)
        print(f'Checking segment {segment.hash} {t_range} (path: {path})',
              file=sys.stderr)

        original = Clip(path, ar=1000)
        start = t_range.value
        end = t_range.value + max(t_range.duration - video.duration, 0) + 600

        try:
            offset, score = find_offset(template, original, start=start,
                                        end=end, min_score=50)
        except Exception:
            continue

        offset -= 300

        if score > 0:
            matching_segment = segment
            video_offset = Timecode(round(offset))
            print(f'Match found: segment {segment.hash}, offset {video_offset}',
                  file=sys.stderr)
            break

    if matching_segment is None:
        print('Error: Video does not match any streams', file=sys.stderr)
        sys.exit(2)

    segment_kwargs['offset'] = video_offset

    if segment.stream.type == StreamType.JOINED and not fail_if_cut:
        print('Matching stream is joined, forcing --fail-if-cut')
        fail_if_cut = True

    if fail_if_cut:
        print('Checking for cuts...')
        diff = check_cuts(original, video, offset=video_offset.value)
        if diff > 1:
            print(f'Error: The video is {int(diff)} seconds shorter '
                   'than the original.', file=sys.stderr)
            sys.exit(3)

    if segment.note:
        segment_kwargs['note'] = segment.note

    if video_offset == 0 and fail_if_cut:
        if len(segment.cuts) > 0:
            segment_kwargs['cuts'] = segment.cuts

        if segment.stream.type == StreamType.JOINED:
            segment_kwargs['offsets'] = segment.offsets

        if segment.offset(0) != 0:
            segment_kwargs['offset'] = segment.offset(0)

    segment = cmd_add(matching_segment.stream, segment_kwargs)
    return matching_segment.stream, segment


def check_cuts(original_video, input_video, offset=0):
    template = input_video.slice(input_video.duration - 600, 300)[0]

    new_offset, _ = find_offset(
        template, original_video,
        start=offset,
        end=offset + int(input_video.duration),
        reverse=True,
        min_score=10)

    return new_offset - (input_video.duration - 600) - offset


def cmd_cuts(segment, segment_kwargs, directory=None):
    if 'youtube' in segment_kwargs:
        video = ytdl_video(segment_kwargs['youtube'])
    elif 'direct' in segment_kwargs:
        video = Clip(segment_kwargs['direct'], ar=1000)

    original = Clip(original_video(segment, directory), ar=1000)
    diff = check_cuts(original, video, offset=Timecode(segment.offset).value)

    if diff <= 1:
        print('The video is the same as the original')
    else:
        print(f'The video is {int(diff)} seconds shorter than the original')
        sys.exit(1)


def ytdl_best_source(video_id, quality='best'):
    p = run(['youtube-dl', '-gf', quality, '--', video_id], stdout=PIPE)

    if p.returncode != 0:
        raise RuntimeError(f'youtube-dl exited with non-zero code {p.returncode}')

    return p.stdout.decode('utf-8').strip()


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    if args['stream'] and args['add']:
        stream_id = args['<stream>']

        if stream_id in streams:
            raise Exception(f'Stream {stream_id} already exists')

        stream = Stream(key=stream_id, data=[{}])

        if not args['--dry-run']:
            streams[stream_id] = stream
            streams.save()

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

        if args['get']:
            print(segment)
            return

        # Parse segment options
        options = (('youtube', str, 'youtube'),
                   ('direct', str, 'direct'),
                   ('offset', Timecode, 'offset'),
                   ('end', Timecode, 'end'),
                   ('duration', Timecode, 'duration'),
                   ('unofficial', lambda x: False if x else None, 'official'))
        segment_kwargs = dict()

        for option, type, key in options:
            if args.get(f'--{option}') is not None:
                value = type(args[f'--{option}'])
                if value is not None:
                    segment_kwargs[key] = type(args[f'--{option}'])

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
            del segment_kwargs['offset']
            stream, segment = cmd_match(segment_kwargs,
                                        directory=args['--directory'],
                                        match_all=args['--all'],
                                        fail_if_cut=args['--fail-if-cut'])

        if args['cuts']:
            cmd_cuts(segment, segment_kwargs, directory=args['--directory'])
            return

        if args['add'] or args['match']:
            # Do not write duration into streams.json
            segment._duration = Timecode(0)

            if len(stream) == 1:
                commit_title = f'Запись стрима {stream.twitch}'
            else:
                commit_title = f'Запись сегмента {segment.hash}'

            commit_msg = '\n'.join(flat([
                [commit_title, ''],
                [f'* {ref.game.name} — {subref.name} [{subref._coverage}%]'
                 for ref in segment.references
                 for subref in ref.subrefs]
            ]))

        if not args['--dry-run']:
            games.save()
            streams.save()

            if commit_msg and args['--commit']:
                repo = Repo('data/')
                repo.index.add(['streams.json', 'games.json'])
                repo.index.commit(commit_msg)

        print(stream)

    if args['game'] and args['add']:
        game_id = args['<game>']
        category_id = args['<category>']
        name = args['<name>']

        if game_id in [game.id for game in games]:
            raise Exception(f'Game {game_id} already exists')

        if category_id not in categories:
            raise Exception(f'Category {category_id} does not exist')

        game = Game(name=name, category=category_id, id=game_id)
        games.append(game)

        if not args['--dry-run']:
            games.save()

        print(game)

    if args['ref'] and args['add']:
        game_id = args['<game>']
        stream_id = args['<stream>']
        segment_id = int(args['<segment>'] or 0)
        name = args['--name']
        start = Timecode(args['--start'] or 0)

        game = list([game for game in games if game.id == game_id])

        if len(game) == 0:
            raise Exception(f'Game {game_id} does not exist')
        else:
            game = game[0]

        if stream_id not in streams:
            raise Exception(f'Stream {stream_id} does not exist')

        stream = streams[stream_id]

        if segment_id > 0 and len(stream) < segment_id + 1:
            raise Exception(f'Segment {stream_id}.{segment_id} does not exist')

        segment = stream[segment_id]

        ref = list([ref for ref in game.streams if ref.parent == segment])

        if len(ref) > 0:
            ref = ref[0]

            if len([sr for sr in ref.subrefs if sr.start == start]) > 0:
                raise Exception(f'Subref with start at {start} already exists')

            SubReference(name=name, start=start, parent=ref)
        else:
            ref = SegmentReference(game=game, parent=segment,
                                   name=name, start=start)

            game.streams.append(ref)

        if not args['--dry-run']:
            games.save()

        print(ref)

    if args['copyright'] and args['mute']:
        tc = timecodes[args['<stream>']]
        tc_ranges = Timecodes(tc['Проблемы с правообладателями'])

        def tc_to_ff(t):  # Convert timecodes to ffmpeg's time ranges
            result = []

            if isinstance(t, Timecodes):
                for t1 in t:
                    result += tc_to_ff(t1)
            elif t.duration:
                result.append(f'between(t,{t.value},{t.value+t.duration})')
            else:
                print(f'Ignoring timecode {t} (no duration)', file=sys.stderr)

            return result

        filters = [f"volume=enable='{f_range}':volume=0"
                   for f_range in tc_to_ff(tc_ranges)]

        cmd = ['ffmpeg', '-i', args['<input>'],
               '-c:v', 'copy', '-strict', '-2',
               '-af', ",".join(filters),
               args['<output>']]

        if args['--dry-run']:
            print(' '.join([f'"{arg}"' if "'" in arg else arg
                            for arg in cmd]))
            return

        p = run(cmd)
        sys.exit(p.returncode)


if __name__ == '__main__':
    main()
