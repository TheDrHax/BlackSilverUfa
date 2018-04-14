#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from datetime import timedelta


class Timecode(object):
    negative = False

    @staticmethod
    def text_to_sec(t):
        s = sum(int(x) * 60 ** i
                for i, x in enumerate(reversed(t.split(":"))))
        return -s if t[0] is '-' else s

    @staticmethod
    def sec_to_text(s):
        return str(timedelta(seconds=s))

    def __init__(self, timecode):
        if (type(timecode) is str):
            value = self.text_to_sec(timecode)
        elif (type(timecode) is int):
            value = timecode
        elif (type(timecode) is Timecode):
            value = int(timecode)
        else:
            value = 0

        self.value = abs(value)
        self.negative = value < 0

    def __str__(self):
        return ('-' if self.negative else '') + self.sec_to_text(self.value)

    def __int__(self):
        return (-1 if self.negative else 1) * self.value

    @staticmethod
    def _type_check(arg):
        if (type(arg) is not Timecode):
            raise TypeError("Unsupported argument type")

    def __add__(self, other):
        self._type_check(other)
        return Timecode(int(self) + int(other))

    def __sub__(self, other):
        self._type_check(other)
        return Timecode(int(self) - int(other))

    def __ge__(self, other):
        self._type_check(other)
        return int(self) >= int(other)

    def __gt__(self, other):
        self._type_check(other)
        return int(self) > int(other)
