#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from datetime import datetime


class Timecode(object):
    @staticmethod
    def text_to_sec(t):
        if len(t) == 0:
            return 0
        negative = (t[0] == '-')
        if negative:
            t = t[1:]
        s = sum(int(x) * 60 ** i
                for i, x in enumerate(reversed(t.split(":"))))
        return -s if negative else s

    @staticmethod
    def sec_to_text(s):
        result = []
        if s < 60:
            return '00:' + str(s).zfill(2)
        for i in [24*60*60, 60*60, 60, 1]:  # days, hours, minutes, seconds
            if len(result) > 0 or s // i > 0:
                result.append(str(s // i).zfill(2))
            s = s % i
        return ':'.join(result)

    def __init__(self, timecode, name=None):
        if (type(timecode) is str):
            value = self.text_to_sec(timecode)
        elif (type(timecode) is int):
            value = timecode
        elif (type(timecode) is Timecode):
            value = int(timecode)
        else:
            value = 0

        self.name = name
        self.value = abs(value)
        self.negative = value < 0

    def __str__(self):
        return ('-' if self.negative else '') + self.sec_to_text(self.value)

    def __repr__(self):
        return str(self)

    def __int__(self):
        return (-1 if self.negative else 1) * self.value

    @staticmethod
    def _type_check(arg):
        if not (isinstance(arg, Timecode) or isinstance(arg, int)):
            raise TypeError(type(arg))

    def __add__(self, other):
        self._type_check(other)
        return Timecode(int(self) + int(other), self.name)

    def __sub__(self, other):
        self._type_check(other)
        return Timecode(int(self) - int(other), self.name)

    def __eq__(self, other):
        if isinstance(other, Timecode):
            return self.value == other.value
        elif isinstance(other, int) or isinstance(other, str):
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


class Timecodes(Timecode, list):
    def __init__(self, timecodes={}, name=None):
        if type(timecodes) is not dict:
            raise TypeError(type(timecodes))

        self.name = name
        for key, value in timecodes.items():
            try:
                self.append(Timecode(key, value))
            except ValueError:
                self.append(Timecodes(value, key))

    def __int__(self):
        return int(self[0]) if len(self) > 0 else 0

    def append(self, value):
        if not isinstance(value, Timecode):
            raise TypeError(type(value))
        for i, item in enumerate(self):
            if item >= value:
                return list.insert(self, i, value)
        return list.append(self, value)

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

    #
    # Disguise as the smallest timecode in the list
    #

    @property
    def value(self):
        return self[0].value or 0

    @property
    def negative(self):
        return self[0].negative or False


class TimecodesSlice(Timecodes):
    def __init__(self, parent, start=Timecode(0), end=Timecode('7:00:00:00')):
        self.parent = parent
        self.start = start
        self.end = end

    def start_at(self, offset):
        self.start = offset

    def end_at(self, offset):
        self.end = offset

    def _load(self):
        ts = Timecodes(name=self.name)
        for t in self.parent:
            if isinstance(t, Timecodes):
                tss = TimecodesSlice(t, self.start, self.end)
                if len(tss) > 0:
                    ts.append(tss)
            elif isinstance(t, Timecode) and self.start <= t < self.end:
                ts.append(t - self.start)

        # Expand timecode list
        if len(ts) == 1 and isinstance(ts[0], Timecodes):
            tl = ts[0]
            del ts[0]
            for t in tl:
                ts.append(t)

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
        return self.parent.value

    @property
    def negative(self):
        return self.parent.negative


class TimecodeHelper:
    delay = 15  # Delay of `streamlink --stream-url` + `mpv` (quality='best')

    @staticmethod
    def time():
        """Get current time as Timecode."""
        return Timecode(str(datetime.time(datetime.now())).split('.')[0])

    def __init__(self, start):
        self.start = Timecode(start)

    def get(self):
        return self.time() - self.start - Timecode(self.delay)
