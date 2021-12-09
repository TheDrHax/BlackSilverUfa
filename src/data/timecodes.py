import attr
import json
from typing import Union

from datetime import datetime
from natsort import natsorted
from sortedcontainers import SortedKeyList
from cached_property import cached_property

from ..utils import join, indent, load_json


TIMECODES_JSON = 'data/timecodes.json'


class Timecode(object):
    @staticmethod
    def _text_to_sec(t):
        if len(t) == 0:
            return 0

        negative = (t[0] == '-')
        if negative:
            t = t[1:]

        s = sum(int(x) * 60 ** i
                for i, x in enumerate(reversed(t.split(':'))))

        return -s if negative else s

    @staticmethod
    def _sec_to_text(s):
        negative = (s < 0)

        if negative:
            s = -s

        if s < 60:
            return ('-' if negative else '') + '0:' + str(s).zfill(2)

        result = []
        for i in [60*60, 60, 1]:  # hours, minutes, seconds
            if s // i > 0 or len(result) > 0:
                if len(result) == 0:
                    result.append(str(s // i))
                else:
                    result.append(str(s // i).zfill(2))
            s = s % i

        return ('-' if negative else '') + ':'.join(result)

    name = None
    value = 0
    duration = None

    def __init__(self, timecode=0, name=None):
        if name:
            self.name = name

        if type(timecode) is str:
            if '~' in timecode:
                split = timecode.split('~')

                if len(split) != 2:
                    raise ValueError('Invalid range format: ' + timecode)

                self.value = self._text_to_sec(split[0])
                self.duration = self._text_to_sec(split[1]) - self.value
            else:
                self.value = self._text_to_sec(timecode)
        elif type(timecode) is int:
            self.value = timecode
        elif type(timecode) is float:
            self.value = int(timecode)
        elif type(timecode) is Timecode:
            self.value = timecode.value
            self.duration = timecode.duration

    @property
    def start(self) -> 'Timecode':
        return self

    @start.setter
    def start(self, value: 'Timecode'):
        if self.duration:
            self.duration -= value.value - self.value

        self.value = value.value

    @property
    def end(self) -> 'Timecode':
        if self.duration:
            return self + self.duration
        else:
            return self

    @end.setter
    def end(self, value: 'Timecode'):
        self.duration = value.value - self.value

    def __str__(self):
        result = self._sec_to_text(self.value)

        if self.duration:
            result += '~'
            result += self._sec_to_text(self.value + self.duration)

        return result

    def __repr__(self):
        return str(self)

    def __int__(self):
        return self.value

    def __add__(self, other):
        t = Timecode(int(self) + int(other), self.name)
        t.duration = self.duration
        return t

    def __sub__(self, other):
        t = Timecode(int(self) - int(other), self.name)
        t.duration = self.duration
        return t

    def __neg__(self):
        t = Timecode(-int(self), self.name)
        t.duration = self.duration
        return t

    def __eq__(self, other):
        if isinstance(other, Timecode):
            return self.value == other.value
        elif isinstance(other, int):
            return int(self) == other
        elif isinstance(other, str):
            return self == Timecode(other)
        else:
            return False

    def __contains__(self, other):
        if not isinstance(other, Timecode):
            other = Timecode(other)

        if not self.duration:
            return self == other

        return self.value <= other <= self.value + self.duration

    def __ge__(self, other):
        return int(self) >= int(other)

    def __gt__(self, other):
        return int(self) > int(other)

    def __le__(self, other):
        return int(self) <= int(other)

    def __lt__(self, other):
        return int(self) < int(other)


class Timecodes(Timecode, SortedKeyList):
    def _from_dict(self, timecodes):
        for key, value in timecodes.items():
            if type(value) in [dict, list]:
                self.add(Timecodes(value, key))
            elif type(value) is str:
                self.add(Timecode(key, value))
            else:
                raise TypeError(type(value))

    def _from_list(self, timecodes):
        for value in timecodes:
            self.add(Timecode(value))

    # Ignore SortedKeyList.__new__
    __new__ = Timecode.__new__

    def __init__(self, timecodes: Union[list, dict, 'Timecodes'] = {},
                 name: str = None):
        SortedKeyList.__init__(self, key=lambda x: int(x))
        self.name = name

        if isinstance(timecodes, Timecodes):
            if timecodes.is_list:
                timecodes = timecodes.to_list()
            else:
                timecodes = timecodes.to_dict()

        if isinstance(timecodes, dict):
            self._from_dict(timecodes)
        elif isinstance(timecodes, list):
            self._from_list(timecodes)
        else:
            raise TypeError(type(timecodes))

    @property
    def is_list(self):
        for value in self:
            if value.name:
                return False
        return True

    _add = SortedKeyList.add

    def add(self, t):
        if isinstance(t, Timecodes) and t in self:
            t1 = [t2 for t2 in self if t2.name == t.name][0]
            t1.update(t)
            return

        return self._add(t)

    def __contains__(self, value):
        if isinstance(value, Timecodes):
            for t in self:
                if isinstance(t, Timecodes) and value.name == t.name:
                    return True
            return False
        else:
            for t in self:
                if isinstance(t, Timecodes) and value in t:
                    return True
                elif t == value:
                    return True
            return False

    def transform(self, func=lambda t: t) -> 'Timecodes':
        tc = Timecodes(name=self.name)
        for t in self:
            if isinstance(t, Timecodes):
                tc.add(t.transform(func))
            elif t.duration:
                t_new = func(Timecode(t.value, name=t.name))
                t_new.duration = int(func(t + t.duration) - t_new)
                tc.add(t_new)
            else:
                tc.add(func(t))
        return tc

    def to_list(self):
        return [str(tc) for tc in self]

    def to_dict(self):
        result = {}

        for tc in self:
            if isinstance(tc, Timecodes):
                if tc.is_list:
                    result[tc.name] = tc.to_list()
                else:
                    result[tc.name] = tc.to_dict()
            else:
                result[str(tc)] = tc.name

        return result

    def __add__(self, value: Union[Timecode,int,str]) -> 'Timecodes':
        value = Timecode(value)
        result = Timecodes({}, self.name)

        for tc in self:
            result.add(tc + value)
        
        return result

    def __sub__(self, value: Union[Timecode,int,str]) -> 'Timecodes':
        return self.__add__(-value)

    #
    # Disguise as the smallest timecode in the list
    #

    def __int__(self):
        return abs(self[0].value if len(self) > 0 else 0)

    @property
    def value(self):
        return int(self)


@attr.s(auto_attribs=True)
class TimecodesSlice(Timecodes):
    segment: Union['Segment', 'SegmentReference'] = attr.ib()
    parent: Timecodes = attr.ib()

    def in_range(self, t):
        if t < self.segment.abs_start:
            return False

        if self.segment.force_start and t < self.segment.start:
            return False

        if self.segment.abs_end != 0 and t >= self.segment.abs_end:
            return False

        for cut in self.segment.cuts:
            if t in cut:
                return False

        return True

    @cached_property
    def _data(self):
        ts = Timecodes(name=self.name)

        for t in self.parent:
            if isinstance(t, Timecodes):
                tss = TimecodesSlice(parent=t, segment=self.segment)
                if len(tss) > 0:
                    ts.add(tss)
            elif isinstance(t, Timecode):
                duration = t.duration or 0

                left = self.in_range(t)
                right = self.in_range(t + duration)

                if not left and not right:
                    continue
                elif left and not right:  # start only
                    t = Timecode(t.value, t.name)
                elif not left and right:  # end only
                    t = Timecode(t.value + duration, t.name) 
                elif t.duration: # both ends
                    delta = self.segment.offset(t + t.duration) - self.segment.offset(t)
                    t.duration -= delta.value

                ts.add(t - self.segment.offset(t))

        # Collapse timecode list
        if len(ts) == 1 and isinstance(ts[0], Timecodes) and not ts[0].is_list:
            tl = ts[0]
            del ts[0]
            for t in tl:
                ts.add(t)

        return ts

    def __len__(self):
        return len(self._data)

    def __getitem__(self, i):
        return self._data[i]

    def __iter__(self):
        return self._data.__iter__()

    def __repr__(self):
        return self._data.__repr__()

    #
    # Disguise as the smallest timecode in the list
    #

    def __int__(self):
        return abs(self[0].value)

    @property
    def value(self):
        return int(self)

    @property
    def name(self):
        return self.parent.name


class TimecodeHelper:
    offset = 8  # Constant for low latency streamlink + MPV without cache

    @staticmethod
    def time():
        """Get current time as Timecode."""
        return Timecode(str(datetime.time(datetime.now())).split('.')[0])

    def __init__(self, start):
        self.start = Timecode(start)

    def __call__(self):
        t = self.time() - self.start - Timecode(self.offset)
        if t.value < 0:
            t += Timecode('24:00:00')
        return t

    get = __call__


class TimecodesDatabase(dict):
    def __init__(self, filename: str = TIMECODES_JSON):
        self.filename = filename
        self.update(load_json(filename))

    @join()
    def to_json(self) -> str:
        yield '{\n'

        first = True
        for key, value in natsorted(self.items(), key=lambda x: x[0]):
            if not first:
                yield ',\n'
            else:
                first = False

            yield f'  "{key}": '
            yield indent(json.dumps(value, indent=2, ensure_ascii=False), 2)[2:]

        yield '\n}'

    def __str__(self):
        return self.to_json()

    def save(self, filename: str = None):
        if filename is None:
            filename = self.filename

        data = self.to_json()

        with open(filename, 'w') as fo:
            fo.write(data)
            fo.write('\n')


timecodes = TimecodesDatabase()
