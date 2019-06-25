#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from datetime import datetime
from sortedcontainers import SortedKeyList

from ..utils import load_json


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
        for i in [24*60*60, 60*60, 60, 1]:  # days, hours, minutes, seconds
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

    def __init__(self, timecode, name=None):
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
        elif type(timecode) is Timecode:
            self.value = timecode.value
            self.duration = timecode.duration

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

    @staticmethod
    def _type_check(arg):
        if not (isinstance(arg, Timecode) or isinstance(arg, int)):
            raise TypeError(type(arg))

    def __add__(self, other):
        self._type_check(other)
        t = Timecode(int(self) + int(other), self.name)
        t.duration = self.duration
        return t

    def __sub__(self, other):
        self._type_check(other)
        t = Timecode(int(self) - int(other), self.name)
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

    def __ge__(self, other):
        self._type_check(other)
        return int(self) >= int(other)

    def __gt__(self, other):
        self._type_check(other)
        return int(self) > int(other)

    def __le__(self, other):
        self._type_check(other)
        return int(self) <= int(other)

    def __lt__(self, other):
        self._type_check(other)
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

    def __init__(self, timecodes={}, name=None):
        SortedKeyList.__init__(self, key=lambda x: int(x))
        self.name = name

        if type(timecodes) is dict:
            self._from_dict(timecodes)
        elif type(timecodes) is list:
            self._from_list(timecodes)
        else:
            raise TypeError(type(timecodes))

    @property
    def is_list(self):
        for value in self:
            if value.name:
                return False
        return True

    def __contains__(self, value):
        if isinstance(value, Timecodes):
            return list.__contains__(self, value)
        else:
            for t in self:
                if isinstance(t, Timecodes) and value in t:
                    return True
                elif t == value:
                    return True
            return False

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

    #
    # Disguise as the smallest timecode in the list
    #

    def __int__(self):
        return abs(self[0].value)

    @property
    def value(self):
        return int(self)


class TimecodesSlice(Timecodes):
    def __init__(self, parent,
                 start=Timecode(0),
                 offset=Timecode(0),
                 end=Timecode('7:00:00:00')):
        self.parent = parent
        self.start = start
        self.offset = offset
        self.end = end

    def _load(self):
        def in_range(t):
            return max(self.offset, self.start) <= t < self.end

        ts = Timecodes(name=self.name)

        for t in self.parent:
            if isinstance(t, Timecodes):
                tss = TimecodesSlice(t, self.start, self.offset, self.end)
                if len(tss) > 0:
                    ts.add(tss)
            elif isinstance(t, Timecode):
                duration = t.duration or 0

                if not in_range(t) and not in_range(t + duration):
                    continue

                if in_range(t) and not in_range(t + duration):  # start only
                    t = Timecode(t.value, t.name)
                
                if not in_range(t) and in_range(t + duration):  # end only
                    t = Timecode(t.value + duration, t.name)

                ts.add(t - self.offset)

        # Collapse timecode list
        if len(ts) == 1 and isinstance(ts[0], Timecodes) and not ts[0].is_list:
            tl = ts[0]
            del ts[0]
            for t in tl:
                ts.add(t)

        return ts

    def __len__(self):
        return len(self._load())

    def __getitem__(self, i):
        return self._load()[i]

    def __iter__(self):
        return self._load().__iter__()

    def __repr__(self):
        return self._load().__repr__()

    #
    # Use dynamic properties from parent
    #

    @property
    def name(self):
        return self.parent.name

    @property
    def value(self):
        return int(self.parent - self.start)


class TimecodeHelper:
    delay = 10  # Delay of experimental low latency streamlink + MPV without cache

    @staticmethod
    def time():
        """Get current time as Timecode."""
        return Timecode(str(datetime.time(datetime.now())).split('.')[0])

    def __init__(self, start):
        self.start = Timecode(start)

    def __call__(self):
        t = self.time() - self.start - Timecode(self.delay)
        if t.value < 0:
            t += Timecode('24:00:00')
        return t
    
    get = __call__


timecodes = load_json('data/timecodes.json')
