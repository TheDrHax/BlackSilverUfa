import attr
import json
import requests
from enum import Enum
from cached_property import cached_property
from typing import Callable, List, Tuple, Dict, Any, Union
from hashlib import md5
from datetime import datetime
from subprocess import run, PIPE
from sortedcontainers import SortedList, SortedKeyList

from .cache import cached
from ..config import config, tcd_config
from .blacklist import Blacklist, BlacklistTimeline
from .timecodes import Timecode, Timecodes
from ..utils import _, last_line, count_lines, join, json_escape, indent
from ..utils.ass import SubtitlesStyle


try:
    from git import Repo

    try:
        repo = Repo('data/')
    except Exception:
        repo = None
except ImportError:
    repo = None


@attr.s(auto_attribs=True, kw_only=True, repr=False, cmp=False)
class Segment:
    note: Union[str, None] = None
    youtube: Union[str, None] = None
    direct: Union[str, None] = None
    vk: Union[str, None] = None
    hls: Union[str, None] = None
    torrent: Union[str, None] = None
    official: bool = True
    force_start: bool = False

    start: Timecode = attr.ib(0, converter=Timecode)
    end: Timecode = attr.ib(0, converter=Timecode)
    _offset: Timecode = attr.ib(0, converter=Timecode)
    offsets: Timecodes = attr.ib(factory=list, converter=Timecodes)  # for joined streams
    _duration: Timecode = attr.ib(0, converter=Timecode)
    cuts: Timecodes = attr.ib(factory=list, converter=Timecodes)

    stream: 'Stream' = attr.ib()  # depends on _offset

    references: SortedList = attr.ib(init=False)
    fallbacks: dict = attr.ib(init=False)
    timecodes: Timecodes = attr.ib(init=False)

    def joined_timecodes(self) -> Timecodes:
        res = Timecodes()

        for i, (stream, offset) in enumerate(zip(self.stream.streams, self.offsets)):
            ts = stream[0].timecodes + offset
            ts = ts.filter(lambda t: t > 0)

            for t in ts:
                if not isinstance(t, Timecodes) or t not in res:
                    res.add(t)
                    continue

                t1, _ = res.find(t, depth=0)

                if not isinstance(t1, Timecodes):
                    res.add(t)
                    continue

                if len(set(t.name for t in res).intersection(t.name for t in t1)) == 0:
                    t1.update(t)
                else:
                    if t.name:  # always true
                        t.name += ' (продолжение)'
                    res.add(t)

            if i > 0 and offset > 0 and offset not in res:
                res.add(Timecode(offset.end, name=f'{i+1}-й стрим'))

        return res

    def timecode_transformer(self) -> Callable[[Timecode], Union[Timecode, None]]:
        abs_start = self.abs_start
        abs_end = self.abs_end

        def func(t: Timecode) -> Union[Timecode, None]:
            # filters
            if any([
                t < abs_start,
                self.force_start and t < self.start,
                abs_end != 0 and t >= abs_end,
                *[t in cut for cut in self.cuts]
            ]):
                return None

            t -= self.offset(t)

            return t

        return func

    def __attrs_post_init__(self):
        self.references = SortedList(key=lambda x: x.start)
        self.fallbacks = dict()

        if self.stream.type is StreamType.JOINED:
            timecodes = self.joined_timecodes()
        else:
            timecodes = self.stream.timecodes

        self.timecodes = timecodes.transform(self.timecode_transformer())

    @property
    def all_cuts(self) -> Timecodes:
        if self.stream.type is StreamType.JOINED:
            cuts = Timecodes(self.cuts)

            for stream, offset in zip(self.stream.streams, self.offsets):
                offset += sum(t.duration for t in cuts if t < offset)
                cuts.update(stream.cuts + offset)

            return cuts

        return Timecodes(list(self.stream.cuts) + list(self.cuts))

    def offset(self, t: Timecode = Timecode(0)) -> Timecode:
        cuts = sum([cut.duration for cut in self.cuts if cut <= t])
        return self._offset + cuts

    def __setattr__(self, name, value):
        if name in ['offset', '_offset']:
            refresh = False
            if hasattr(self, 'stream'):
                if isinstance(self.stream, Stream):
                    if self in self.stream:
                        self.stream.remove(self)
                        refresh = True
            super().__setattr__('_offset', value)
            if refresh:
                self.stream.add(self)
            return

        if name == 'stream':
            if hasattr(self, 'stream'):
                if isinstance(self.stream, Stream):
                    if self in self.stream:
                        self.stream.remove(self)
            super().__setattr__(name, value)
            self.stream.add(self)
            return

        return super().__setattr__(name, value)

    @property
    def twitch(self) -> str:
        return self.stream.twitch

    @property
    def segment(self) -> int:
        return self.stream.index(self)

    @property
    def all_subrefs(self) -> List['SubReference']:
        return sorted([sr
                       for r in self.references
                       for sr in r.subrefs
                       if not sr.hidden],
                      key=lambda sr: sr.start)

    @property
    def games(self) -> List['Game']:
        return list(ref.game for ref in self.references)

    @property
    def name(self) -> str:
        names = []
        prev_game = None

        for sr in self.all_subrefs:
            name = sr.full_name

            if name not in names:
                if ' - ' in name:
                    game, light_name = name.split(' - ', 1)

                    if prev_game == game:
                        names[-1] += f' | {light_name}'
                        prev_game = game
                        continue

                    prev_game = game
                else:
                    prev_game = None

                names.append(name)

        return ' / '.join(names)

    def reference(self):
        return SegmentReference(
            parent=self.references[0],
            game=self.references[0].game,
            name=self.name,
            silent=True)

    @property
    def playable(self):
        return True in [getattr(self, key) is not None
                        for key in ['youtube', 'direct', 'hls']]

    @property
    def generated_subtitles(self):
        prefix = config['repos']['mounts']['$PREFIX/chats/generated']['prefix']
        return f'{prefix}/v{self.twitch}+{self.segment}.ass'

    @property
    def subtitles(self):
        if self.generated_subtitles_hash:
            return self.generated_subtitles
        else:
            return self.stream.subtitles

    @property
    def generated_subtitles_path(self):
        return _(f'chats/generated/v{self.twitch}+{self.segment}.ass')

    @property
    def _generated_subtitles_data(self):
        data = []

        if self.stream.type is StreamType.JOINED:
            data += self.offsets.to_list()

        data += self.all_cuts.to_list()

        if len(data) > 0:
            data.append('v2')
            return data

    @property
    def generated_subtitles_hash(self) -> str:
        data = self._generated_subtitles_data

        if data is None:
            return None

        return md5(json.dumps(data).encode('utf-8')).hexdigest()

    @property
    def subtitles_path(self):
        if self.generated_subtitles_hash:
            return self.generated_subtitles_path
        else:
            return self.stream.subtitles_path

    @staticmethod
    @cached('duration-youtube-{0[0]}')
    def _duration_youtube(id):
        cmd = ['yt-dlp', *config['yt-dlp']['args'],
               '--get-duration', f'https://youtu.be/{id}']

        out = run(cmd, stdout=PIPE)

        if out.returncode == 0:
            t = out.stdout.decode('utf-8').strip()
            return int(Timecode(t))
        else:
            raise Exception(f'`{" ".join(cmd)}` exited with '
                            f'non-zero code {out.returncode}')

    @staticmethod
    @cached('duration-direct-{0[0]}', store=None)
    @cached('duration-direct-{0[0]}',
            lambda url: requests.head(url).headers['content-length'])
    def _duration_direct(url: str) -> int:
        cmd = ['ffprobe', '-v', 'error', '-show_format', '-of', 'json', url]
        out = run(cmd, stdout=PIPE)

        if out.returncode == 0:
            stdout = out.stdout.decode('utf-8')
            t = json.loads(stdout)['format']['duration'].split('.')[0]
            return int(Timecode(t))
        else:
            raise Exception(f'`{" ".join(cmd)}` exited with '
                            f'non-zero code {out.returncode}')

    @property
    def duration(self):
        if self._duration != 0:
            return self._duration
        elif self.youtube:
            return Timecode(self._duration_youtube(self.youtube))
        elif self.direct:
            return Timecode(self._duration_direct(self.direct))
        else:
            return Timecode(0)

    @property
    def abs_start(self):
        return self.offset()

    @property
    def abs_end(self):
        if self.end != 0:
            return self.end
        elif self.duration > 0:
            end = self.abs_start + self.duration
            end += sum(cut.duration for cut in self.cuts)
            return end
        elif self.segment == len(self.stream) - 1:
            return self.stream.abs_end
        else:
            return self.stream[self.segment + 1].abs_start

    @property
    def date(self):
        return self.stream.date

    @property
    def hash(self):
        if self.segment == 0:
            return self.twitch
        else:
            return self.twitch + '.' + str(self.segment)

    @join()
    def to_json(self, compiled=False):
        if not compiled:
            keys = ['youtube', 'vk', '_offset', 'source_cuts', 'cuts', 'official',
                    'start', 'end', '_duration', 'force_start']
            multiline_keys = ['direct', 'hls', 'offsets', 'note', 'torrent']
        else:
            keys = ['youtube', 'vk', 'official',
                    'abs_start', 'abs_end', 'duration']
            multiline_keys = ['name', 'date', 'direct', 'hls', 'offsets',
                              'cuts', 'torrent', 'games', 'subtitles', 'note']

        def get_attr(key):
            if key in self.fallbacks and not compiled:
                value = self.fallbacks[key]
            else:
                value = getattr(self, key)

            return value

        multiline = True in [get_attr(key) not in [None, []]
                             for key in multiline_keys]

        yield '{'
        yield '\n  ' if multiline else ' '

        fields = attr.fields_dict(type(self))

        first = True
        for key in keys:
            if key == 'source_cuts':
                if self.segment != 0:
                    continue

                value = self.stream.cuts
            else:
                value = get_attr(key)

            if value is None:
                continue

            if key in fields and fields[key].default == value:
                continue

            if isinstance(value, Timecodes):
                if len(value) == 0:
                    continue

                value = value.to_list()

            if isinstance(value, Timecode):
                if not compiled and value == 0:
                    continue
                
                if compiled:
                    value = int(value)

            if not first:
                yield ', '
            else:
                first = False

            if key.startswith('_'):
                key = key[1:]

            yield f'"{key}": {json_escape(value)}'

        for key in multiline_keys:
            value = get_attr(key)

            if key == 'date':
                value = value.date().isoformat()

            if value is None:
                continue

            if key == 'offsets':
                if self.stream.type is StreamType.JOINED:
                    value = value.to_list(delta=True)
                else:
                    continue

            if key == 'subtitles' and self.stream.type is StreamType.NO_CHAT:
                continue

            if key == 'cuts' and compiled:
                if len(value) == 0:
                    continue

                value = [[int(t.start), int(t.end)] for t in value]

            if key == 'games':
                value = list(game.id for game in self.games)

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
        return f'Segment({self.hash})'


@attr.s(auto_attribs=True, kw_only=True, repr=False, cmp=False)
class SegmentReference:
    game: 'Game' = attr.ib()
    note: str = None
    _name: str = None
    _start: Timecode = attr.ib(0, converter=Timecode)
    _blacklist: Blacklist = attr.ib({}, converter=lambda x: Blacklist(**x))
    silent: bool = False
    _subrefs: list = attr.ib(factory=list)
    subrefs: List['SubReference'] = attr.ib(init=False)
    _parent: Segment = attr.ib()
    parent: Segment = attr.ib(init=False)

    def __attrs_post_init__(self):
        if not self.game:
            if not isinstance(self.parent, SegmentReference):
                raise ValueError('`game` is required when referencing Segment')
            self.game = self.parent.game

        self.subrefs = SortedKeyList(key=lambda x: x.start)

        if len(self._subrefs) > 0:
            if len(self._blacklist) > 0:
                raise ValueError('`blacklist` can not be used with `subrefs`')

            for data in self._subrefs:
                if isinstance(data, dict):
                    SubReference(**data, parent=self)
                elif isinstance(data, SubReference):
                    if data.parent is not self:
                        data.parent = self
                else:
                    raise TypeError(f'Unsupported subref type: {type(data)}')

        delattr(self, '_subrefs')

        if len(self.subrefs) == 0:
            if not self._name:
                raise ValueError('`name` is required without `subrefs`')

            SubReference(name=self._name, start=self._start, parent=self,
                         blacklist=self._blacklist)

        delattr(self, '_name')
        delattr(self, '_start')

        self.parent = self._parent
        delattr(self, '_parent')

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
            raise AttributeError(f'No such attribute: {name}')

    def __getattribute__(self, name):
        value = super().__getattribute__(name)

        if name in ['start', 'end'] and value == 0:
            return getattr(self.parent, name)

        if value is None:
            return getattr(self.parent, name)

        return value

    @property
    def name(self) -> str:
        names = []
        for subref in self.subrefs:
            if subref.name not in names and not subref.hidden:
                names.append(subref.name)
        return ' / '.join(names)

    @property
    def start(self) -> Timecode:
        return self.subrefs[0].start

    @start.setter
    def start(self, value):
        self.subrefs[0].start = value

    @property
    def abs_start(self):
        if self.start != 0:
            return self.start
        else:
            return self.parent.abs_start

    @property
    def abs_end(self):
        return self.subrefs[-1].abs_end

    @join()
    def to_json(self, compiled: bool = False):
        if compiled:
            keys = ['hash', 'end', 'force_start', 'subrefs']
            multiline_keys = []
        else:
            keys = ['name', 'twitch', 'segment', 'start', 'end',
                    'force_start', 'subrefs']
            multiline_keys = ['note', '_blacklist']

        def inherited(key):
            if key in ['name', 'twitch', 'hash', 'segment', '_blacklist']:
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

            if value is None or inherited(key) and not compiled:
                continue

            if key in ['name', 'start'] and len(self.subrefs) > 1:
                continue

            if key in ['start', 'end']:
                if value == 0:
                    continue

                if compiled:
                    value -= self.offset(value) - self.offset()

            if key == 'subrefs' and len(value) == 1 and not compiled:
                continue

            if key == 'segment':
                if len(self.parent.stream) > 1:
                    yield f', "segment": {self.parent.segment}'
                continue

            if key == 'force_start' and not value:
                continue

            if compiled and key == 'hash':
                key = 'segment'

            if not first:
                yield ', '
            else:
                first = False

            if compiled and isinstance(value, Timecode):
                value = int(value)

            if key == 'subrefs':
                yield f'"{key}": [\n  '
                yield ',\n  '.join(s.to_json(compiled) for s in self.subrefs)
                yield '\n]'
                continue

            yield f'"{key}": {json_escape(value)}'

        for key in multiline_keys:
            value = getattr(self, key)

            if key == '_blacklist' and len(self.subrefs) > 1:
                continue

            if value and not inherited(key):
                if not first:
                    yield ',\n  '
                else:
                    first = False

                if key == '_blacklist':
                    yield f'"blacklist": {indent(value.to_json(), 2)[2:]}'
                else:
                    yield f'"{key}": {json_escape(value)}'

        yield '\n' if multiline else ' '
        yield '}'

    def __str__(self):
        return self.to_json()

    def __repr__(self):
        return f'SegmentReference({self.name}, {self.parent.hash})'


@attr.s(auto_attribs=True, kw_only=True, repr=False, cmp=False)
class SubReference:
    name: str = attr.ib()
    start: Timecode = attr.ib(0, converter=Timecode)
    hidden: bool = attr.ib(False)
    parent: SegmentReference = attr.ib()
    _blacklist: Blacklist = attr.ib({},
        converter=lambda x: x if isinstance(x, Blacklist) else Blacklist(**x))

    def __setattr__(self, name, value):
        if name == 'parent':
            if self.name in [s.name for s in value.subrefs]:
                print(f'WARN: Duplicate subrefs "{self.name}" in '
                      f'"{value.game.id}"')

            if hasattr(self, 'parent') and self.parent:
                self.parent.subrefs.remove(self)

            super().__setattr__(name, value)
            self.parent.subrefs.add(self)

        return super().__setattr__(name, value)

    @property
    def full_name(self) -> str:
        game = self.parent.game

        if game.type == 'list':
            return self.name

        if self.name.split(' ')[0].isnumeric():
            return f'{game.name} #{self.name}'
        else:
            return f'{game.name} - {self.name}'

    @property
    def abs_start(self) -> Timecode:
        if self.start != 0:
            return self.start
        else:
            return self.parent.abs_start

    @property
    def abs_end(self) -> Timecode:
        subrefs = SortedKeyList(key=lambda x: x.abs_start)

        for segment in self.parent.parent.stream:
            for ref in segment.references:
                for subref in ref.subrefs:
                    if subref.abs_start > self.abs_start:
                        subrefs.add(subref)

        if len(subrefs) > 0:
            return subrefs[0].abs_start
        else:
            return self.parent.parent.abs_end

    @cached_property
    def blacklist(self):
        return self.parent.game.blacklist + self._blacklist

    @join()
    def to_json(self, compiled=False):
        multiline = len(self._blacklist) > 0

        yield '{\n    ' if multiline else '{ '

        yield f'"name": {json_escape(self.name)}'

        if self.start != 0:
            if compiled:
                yield f', "start": {int(self.start)}'
            else:
                yield f', "start": {json_escape(self.start)}'

        if self.hidden:
            yield ', "hidden": true'

        if len(self._blacklist) > 0 and not compiled:
            yield f',\n    "blacklist": {indent(self._blacklist.to_json(), 4)[4:]}'

        yield '\n  }' if multiline else ' }'

    def __repr__(self):
        return f'SubReference({self.name}, {self.start})'


class StreamType(Enum):
    DEFAULT = 1
    JOINED = 2
    NO_CHAT = 3


@attr.s(auto_attribs=True, kw_only=True, repr=False, cmp=False)
class Stream:
    _key: str = attr.ib()
    _data: List[dict] = attr.ib()

    meta: Dict[str, Any] = attr.ib(factory=dict)
    streams: List['Stream'] = attr.ib(factory=list)  # for joined streams

    twitch: str = attr.ib(init=False)
    type: StreamType = attr.ib(init=False)
    games: List[Tuple['Game', SegmentReference]] = attr.ib(init=False)
    segments: List[Segment] = attr.ib(init=False)
    timecodes: Timecodes = attr.ib(factory=dict, converter=Timecodes)
    cuts: Timecodes = attr.ib(factory=list, converter=Timecodes)

    @staticmethod
    def _segment_key(s) -> int:
        if hasattr(s, 'fallbacks') and 'offset' in s.fallbacks:
            offset = s.fallbacks['offset']
        else:
            offset = s.offset()

        return int(offset)

    def __attrs_post_init__(self):
        self.twitch = self._key

        if ',' in self.twitch:
            self.type = StreamType.JOINED
        elif self.twitch.startswith('00'):
            self.type = StreamType.NO_CHAT
        else:
            self.type = StreamType.DEFAULT

        self.games = []
        self.segments = SortedKeyList(key=self._segment_key)

        for segment in self._data:
            Segment(stream=self, **segment)

    # Workaround for SortedKeyList.__init__
    def __new__(cls, *args, **kwargs):
        return object.__new__(cls)

    @property
    @cached('duration-twitch-{0[0].twitch}')
    def _duration(self) -> Union[int, None]:
        if self.type is StreamType.NO_CHAT:
            res = max(int(s.abs_end) for s in self)
            return res if res > 0 else None

        line = last_line(self.subtitles_path)
        if line is not None:
            return int(Timecode(line.split(' ')[2].split('.')[0]))

    @property
    def duration(self) -> Timecode:
        if self.type is StreamType.JOINED:
            return Timecode(sum(int(s.duration) for s in self.streams))
        else:
            return Timecode(self._duration)

    @property
    def abs_start(self) -> Timecode:
        return Timecode(0)

    @property
    def abs_end(self) -> Timecode:
        return self.duration

    @property
    @cached('date-{0[0].twitch}')
    def _unix_time(self) -> str:
        if not repo:
            raise ValueError

        args = ['--pretty=oneline', '--reverse', '-S', self.twitch]
        rev = repo.git.log(args).split(' ')[0]
        return repo.commit(rev).authored_date

    @property
    def date(self) -> datetime:
        if self.type is StreamType.JOINED:
            return self.streams[0].date
        elif self.type is StreamType.NO_CHAT:
            return datetime.strptime(self.twitch[2:8], '%y%m%d')
        else:
            try:
                return datetime.fromtimestamp(self._unix_time)
            except ValueError:
                return datetime.now()


    @property
    def subtitles_prefix(self) -> str:
        """Returns public URL prefix of subtitles for this segment."""
        year = str(self.date.year)
        key = f'$PREFIX/chats/{year}'
        if key not in config['repos']['mounts']:
            raise Exception(f'Repository for year {year} is not configured')
        prefix = config['repos']['mounts'][key]['prefix']
        return prefix

    @property
    def subtitles(self) -> str:
        """Returns full public URL of subtitles for this stream."""
        if self.type is StreamType.NO_CHAT:
            return None

        return f'{self.subtitles_prefix}/v{self.twitch}.ass'

    @property
    def subtitles_path(self) -> str:
        """Returns relative path of subtitles in current environment."""
        return _(f'chats/{self.date.year}/v{self.twitch}.ass')

    @property
    def subtitles_style(self) -> SubtitlesStyle:
        style = SubtitlesStyle(tcd_config['ssa_style_format'],
                               tcd_config['ssa_style_default'])

        if self.meta.get('chromakey'):
            style['Alignment'] = '5'
        else:
            style['Alignment'] = '1'

        return style

    @cached_property
    def blacklist(self) -> BlacklistTimeline:
        bl = BlacklistTimeline()

        for segment in self:
            for subref in segment.all_subrefs:
                bl.add(subref.blacklist, subref.abs_start, subref.abs_end)

        return bl

    @property
    @cached('messages-{0[0].twitch}')
    def _messages(self) -> int:
        lines = count_lines(self.subtitles_path)
        return (lines - 10) if lines else None

    @property
    def messages(self) -> int:
        if self.type is StreamType.JOINED:
            return sum([s.messages for s in self.streams])
        else:
            return self._messages or 0

    def __getitem__(self, index: int) -> Segment:
        return self.segments[index]

    def __contains__(self, segment: Segment) -> bool:
        return segment in self.segments

    def __len__(self) -> int:
        return len(self.segments)

    def index(self, segment: Segment) -> int:
        return self.segments.index(segment)

    def add(self, segment: Segment):
        self.segments.add(segment)

    def remove(self, index: int):
        self.segments.remove(index)

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

    def __str__(self) -> str:
        return self.to_json()
