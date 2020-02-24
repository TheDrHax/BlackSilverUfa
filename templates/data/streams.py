import attr
import json
from git import Repo
from datetime import datetime
from subprocess import run, PIPE
from sortedcontainers import SortedList, SortedKeyList

from .cache import cached
from .config import config
from .fallback import FallbackSource
from .timecodes import timecodes, Timecode, Timecodes, TimecodesSlice
from ..utils import _, load_json, last_line, count_lines, join, json_escape, indent


repo = Repo('.')

STREAMS_JSON = 'data/streams.json'


@attr.s(auto_attribs=True, kw_only=True)
class Segment:
    note: str = None
    youtube: str = None
    direct: str = None
    torrent: str = None
    official: bool = True
    force_start: bool = False

    start: Timecode = attr.ib(Timecode(0), converter=Timecode)
    end: Timecode = attr.ib(Timecode(0), converter=Timecode)
    _offset: Timecode = attr.ib(Timecode(0), converter=Timecode)
    cuts: Timecodes = attr.ib([], converter=Timecodes)

    stream: 'Stream' = None  # depends on offset

    twitch: str = attr.ib(init=False)
    references: SortedList = attr.ib(init=False, repr=False)
    fallbacks: dict = attr.ib(init=False, repr=False)
    timecodes: TimecodesSlice = attr.ib(init=False, repr=False)

    def __attrs_post_init__(self):
        self.references = SortedList(key=lambda x: x.start)
        self.fallbacks = dict()
        self.timecodes = TimecodesSlice(parent=self.stream.timecodes,
                                        segment=self)

    def offset(self, t=0):
        cuts = sum([cut.duration for cut in self.cuts if cut <= t])
        return self._offset + cuts

    def __setattr__(self, name, value):
        if name in ['offset', '_offset']:
            super().__setattr__('_offset', value)
            if hasattr(self, 'stream') and self.stream and self in self.stream:
                self.stream.remove(self)
                self.stream.add(self)
            return

        if name == 'stream':
            if hasattr(self, 'stream') and self.stream and self in self.stream:
                self.stream.remove(self)
            super().__setattr__(name, value)
            self.twitch = self.stream.twitch
            self.stream.add(self)
            return

        return super().__setattr__(name, value)

    @property
    def segment(self) -> int:
        return self.stream.index(self)

    def reference(self):
        return SegmentReference(
            parent=self.references[0],
            game=self.references[0].game,
            name=' / '.join([r.game_name for r in self.references]),
            silent=True)

    @property
    def playable(self):
        return True in [getattr(self, key) is not None
                        for key in ['youtube', 'direct']]

    @property
    def cut_subtitles(self):
        return f'{self.stream.subtitles_prefix}/v{self.twitch}+{self.segment}.ass'

    @property
    def subtitles(self):
        if len(self.cuts) > 0:
            return self.cut_subtitles
        else:
            return self.stream.subtitles

    @property
    def cut_subtitles_path(self):
        return _(f'chats/{self.date.year}/v{self.twitch}+{self.segment}.ass')

    @property
    def subtitles_path(self):
        if len(self.cuts) > 0:
            return self.cut_subtitles_path
        else:
            return self.stream.subtitles_path

    @staticmethod
    @cached('duration-youtube-{0[0]}')
    def _duration_youtube(id):
        cmd = ['youtube-dl', '--get-duration', f'https://youtu.be/{id}']
        out = run(cmd, stdout=PIPE)

        if out.returncode == 0:
            t = out.stdout.decode('utf-8').strip()
            return Timecode(t).value
        else:
            raise Exception(f'`{" ".join(cmd)}` exited with '
                            f'non-zero code {out.returncode}')

    @property
    def duration(self):
        if self.youtube:
            return Timecode(self._duration_youtube(self.youtube))
        else:
            return Timecode(0)

    @property
    def abs_start(self):
        if self.offset() != 0:
            return self.offset()
        elif self.segment > 0:
            return self.stream[self.segment - 1].abs_end
        else:
            return Timecode(0)

    @property
    def abs_end(self):
        if self.end != 0:
            return self.end
        elif self.duration.value > 0:
            end = self.abs_start + self.duration
            end += sum(cut.duration for cut in self.cuts)
            return end
        elif self.segment == len(self.stream) - 1:
            return self.stream.duration
        else:
            next_refs = self.stream[self.segment + 1].references
            if len(next_refs) > 0:
                return next_refs[0].abs_start

    @property
    def date(self):
        return self.stream.date

    @property
    def hash(self):
        if self.segment == 0:
            return self.twitch
        else:
            return self.twitch + '.' + str(self.segment)

    @property
    def thumbnail(self):
        if self.youtube:
            return f'https://img.youtube.com/vi/{self.youtube}/mqdefault.jpg'
        else:
            return '/static/images/no-preview.png'

    @join()
    def to_json(self):
        keys = ['youtube', 'direct', 'offset', 'cuts', 'official',
                'start', 'end', 'force_start']
        multiline_keys = ['note']

        def get_attr(key):
            if key in self.fallbacks:
                return self.fallbacks[key]
            else:
                return getattr(self, key)

        multiline = True in [get_attr(key) is not None
                             for key in multiline_keys]

        yield '{'
        yield '\n  ' if multiline else ' '

        first = True
        for key in keys:
            value = get_attr(key)

            if key == 'offset':
                value = self.offset()

            if value is None:
                continue

            if key == 'cuts' and len(self.cuts) == 0:
                continue

            if key in ['offset', 'start', 'end'] and value == 0:
                continue

            if key == 'official' and value:
                continue

            if key == 'force_start' and not value:
                continue

            if not first:
                yield ', '
            else:
                first = False

            if key == 'cuts':
                yield f'"{key}": {json.dumps(self.cuts.to_list())}'
            else:
                yield f'"{key}": {json_escape(value)}'

        for key in multiline_keys:
            value = get_attr(key)

            if value is None:
                continue

            if not first:
                yield ',\n  '
            else:
                first = False

            yield f'"{key}": {json_escape(value)}'

        yield '\n' if multiline else ' '
        yield '}'

    def __str__(self):
        return self.to_json()

    def __repr__(self):
        return self.to_json()


@attr.s(auto_attribs=True, kw_only=True)
class SegmentReference:
    silent: bool = False
    game: 'Game' = None
    name: str = None
    twitch: str = None
    segment: int = 0
    note: str = None
    start: Timecode = attr.ib(Timecode(0), converter=Timecode)
    end: Timecode = attr.ib(Timecode(0), converter=Timecode)
    parent: Segment = None  # depends on silent, start

    def __attrs_post_init__(self):
        if not self.game:
            if not isinstance(self.parent, SegmentReference):
                raise ValueError('`game` is required when referencing Segment')
            self.game = self.parent.game

    def __setattr__(self, name, value):
        if name == 'parent':
            if isinstance(value, SegmentReference):
                value = value.parent

            if hasattr(self, 'parent') and self.parent and not self.silent:
                self.parent.references.remove(self)

            super().__setattr__(name, value)

            if not self.silent:
                self.parent.references.add(self)

        return super().__setattr__(name, value)

    def __getattr__(self, name):
        if 'parent' in self.__dict__:
            return getattr(self.parent, name)
        else:
            raise AttributeError

    def __getattribute__(self, name):
        value = super().__getattribute__(name)

        if name in ['start', 'end'] and value == 0:
            return getattr(self.parent, name)

        if value is None:
            return getattr(self.parent, name)

        return value

    def attrs(self):
        attrs = []

        def escape_attr(attr):
            if type(attr) is str:
                return attr.replace('"', '&quot;')
            else:
                return str(attr)

        def add(key, func=lambda x: x, check=lambda x: x is not None):
            value = getattr(self, key)
            if check(value):
                value = func(value)
                value = escape_attr(value)
                attrs.append(f'data-{key}="{value}"')

        if self.segment != 0:
            add('segment')

        add('offset', lambda x: x().value, lambda x: x() != 0)
        add('subtitles')

        for key in ['start', 'end']:
            add(key, lambda x: int(x - self.offset(x)), lambda x: x != 0)

        for key in ['name', 'twitch', 'youtube', 'direct']:
            add(key)

        if self.force_start:
            add('force_start', lambda x: 'true' if x else 'false')

        if not self.playable:
            attrs.append('style="display: none"')

        return ' '.join(attrs)

    def mpv_file(self):
        if self.youtube:
            return 'ytdl://' + self.youtube
        elif self.direct:
            return self.direct

    def mpv_args(self):
        res = f'--sub-file={self.subtitles} '
        if self.offset() != 0:
            res += f'--sub-delay={-int(self.offset())} '
        if self.start != 0:
            res += f'--start={int(self.start - self.offset(self.start))} '
        if self.end != 0:
            res += f'--end={int(self.end - self.offset(self.end))} '
        return res.strip()

    @property
    def abs_start(self):
        if self.start != 0:
            return self.start
        else:
            return self.parent.abs_start

    @property
    def abs_end(self):
        index = self.references.index(self)

        if index < len(self.references):
            for ref in self.references[index+1:]:
                if ref.start != self.start:
                    return ref.start

        return self.parent.abs_end

    @property
    def game_name(self):
        if self.game.type == 'list':
            return self.name
        else:
            return f'{self.game.name} - {self.name}'

    @join()
    def to_json(self):
        keys = ['name', 'twitch', 'segment', 'start', 'end', 'force_start']
        multiline_keys = ['note']

        def inherited(key):
            if key in ['twitch', 'segment']:
                return False

            if hasattr(self.parent, key):
                if getattr(self, key) == getattr(self.parent, key):
                    return True

            return False

        multiline = True in [getattr(self, key) and not inherited(key)
                             for key in multiline_keys]

        yield '{'
        yield '\n  ' if multiline else ' '

        first = True
        for key in keys:
            value = getattr(self, key)

            if value is None or inherited(key):
                continue

            if key in ['start', 'end'] and value == 0:
                continue

            if key == 'segment':
                if len(self.parent.stream) > 1:
                    yield f', "segment": {self.parent.segment}'
                continue

            if not first:
                yield ', '
            else:
                first = False

            yield f'"{key}": {json_escape(value)}'

        for key in multiline_keys:
            value = getattr(self, key)

            if value and not inherited(key):
                if not first:
                    yield ',\n  '
                else:
                    first = False

                yield f'"{key}": {json_escape(value)}'

        yield '\n' if multiline else ' '
        yield '}'

    def __str__(self):
        return self.to_json()

    def __repr__(self):
        return self.to_json()


class Stream(SortedKeyList):
    def __init__(self, data, key):
        SortedKeyList.__init__(self, key=lambda s: int(Timecode(s.offset())))

        if type(data) is not list:
            raise TypeError(type(data))

        self.twitch = key
        self.games = []
        self.timecodes = Timecodes(timecodes.get(key) or {})

        for segment in data:
            Segment(stream=self, **segment)

    @property
    @cached('duration-twitch-{0[0].twitch}')
    def _duration(self):
        line = last_line(self.subtitles_path)
        if line is not None:
            return int(Timecode(line.split(' ')[2].split('.')[0]))

    @property
    def duration(self):
        return Timecode(self._duration)

    @property
    @cached('date-{0[0].twitch}')
    def _unix_time(self):
        args = ['--pretty=oneline', '--reverse', '-S', self.twitch]
        rev = repo.git.log(args).split(' ')[0]
        return repo.commit(rev).committed_date

    @property
    def date(self):
        return datetime.fromtimestamp(self._unix_time)

    @property
    def subtitles_prefix(self):
        year = str(self.date.year)
        if year not in config['repos']['chats']:
            raise Exception(f'Repository for year {year} is not configured')
        prefix = config['repos']['chats'][year]['prefix']
        return prefix

    @property
    def subtitles(self):
        return f'{self.subtitles_prefix}/v{self.twitch}.ass'

    @property
    def subtitles_path(self):
        return _(f'chats/{self.date.year}/v{self.twitch}.ass')

    @property
    @cached('messages-{0[0].twitch}')
    def _messages(self):
        lines = count_lines(self.subtitles_path)
        return (lines - 10) if lines else None

    @property
    def messages(self):
        return self._messages or 0

    @join()
    def to_json(self):
        if len(self) > 1:
            yield '[\n'

            first = True
            for segment in self:
                if not first:
                    yield ',\n'
                else:
                    first = False

                yield indent(segment.to_json(), 2)

            yield '\n]'
        else:
            yield self[0].to_json()

    def __str__(self):
        return self.to_json()

    def __repr__(self):
        return self.to_json()


class Streams(dict):
    def __init__(self, filename: str = STREAMS_JSON):
        self.filename = filename
        streams = load_json(filename)

        for id, stream in streams.items():
            if type(stream) is dict:
                self[id] = Stream([stream], id)
            elif type(stream) is list:
                self[id] = Stream(stream, id)
            else:
                raise TypeError

    def enable_fallbacks(self):
        fallback = FallbackSource(**config['fallback'])

        items = list(self.items())
        if not fallback.index:
            items = items[-fallback.capacity:]

        for key, stream in items:
            if fallback.streams and False in [s.playable for s in stream]:
                filename = f'{stream.twitch}.mp4'
                if filename in fallback:
                    for segment in stream:
                        if not segment.playable:
                            segment.fallbacks['direct'] = segment.direct
                            segment.direct = fallback.url(filename)
                            segment.fallbacks['offset'] = segment.offset()
                            segment.offset = Timecode(0)

            if fallback.torrents and None in [s.torrent for s in stream]:
                filename = f'{stream.twitch}.torrent'
                if filename in fallback:
                    for segment in stream:
                        if segment.torrent is None:
                            segment.fallbacks['torrent'] = segment.torrent
                            segment.torrent = fallback.url(filename)

    @property
    def segments(self):
        for key, stream in self.items():
            for segment in stream:
                if len(segment.references) > 0:
                    yield segment

    @join()
    def to_json(self) -> str:
        yield '{\n'

        first = True
        for key, stream in self.items():
            if not first:
                yield ',\n'
            else:
                first = False

            yield f'  "{key}": {indent(stream.to_json(), 2)[2:]}'

        yield '\n}'

    def __str__(self):
        return self.to_json()

    def __repr__(self):
        return f'Streams({len(self)})'

    def save(self, filename: str = None):
        if filename is None:
            filename = self.filename

        data = self.to_json()

        with open(filename, 'w') as fo:
            fo.write(data)
            fo.write('\n')


streams = Streams()
