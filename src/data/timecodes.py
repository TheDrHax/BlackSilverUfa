import json

from typing import Callable, Dict, List, Tuple, Union
from sortedcontainers import SortedKeyList
from natsort import natsorted
from ..utils import join, indent, load_json


class Timecode:
    __slots__ = '_start', '_end', 'name'

    INPUT_TYPE = Union['Timecode', int, float, str, None]

    @classmethod
    def _ptime(cls, t: str) -> int:
        if len(t) == 0:
            return 0

        negative = (t[0] == '-')
        if negative:
            t = t[1:]

        s = sum(int(x) * 60 ** i
                for i, x in enumerate(reversed(t.split(':'))))

        return -s if negative else s

    @classmethod
    def _ftime(cls, s: int) -> str:
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

    @classmethod
    def _parse_str(cls, value: str) -> Tuple[int, int]:
        parts = value.split('~')

        if len(parts) == 1:
            start = cls._ptime(parts[0])
            return start, start
        else:
            start, end = [cls._ptime(i) for i in parts]
            return start, end

    PARSERS = {
        'Timecode': lambda x: (x._start, x._end),
        'int': lambda x: (x, x),
        'float': lambda x: [int(x)] * 2,
        'str': lambda x: Timecode._parse_str(x),
        'NoneType': lambda x: (0, 0)
    }

    @classmethod
    def _parse(cls, value: INPUT_TYPE) -> Tuple[int, int]:
        return cls.PARSERS[value.__class__.__name__](value)

    def __init__(self, start: INPUT_TYPE = None, end: INPUT_TYPE = None,
                 name: Union[str, None] = None):
        self.name = name

        if not start:
            self._start, self._end = 0, 0
            return

        self._start, self._end = self._parse(start)

        if end:
            self._end, _ = self._parse(end)

    @property
    def start(self) -> 'Timecode':
        return Timecode(self._start)

    @property
    def end(self) -> 'Timecode':
        return Timecode(self._end)

    @start.setter
    def start(self, value: 'Timecode'):
        self._start = value._start

    @end.setter
    def end(self, value: 'Timecode'):
        self._end = value._start

    @property
    def duration(self) -> 'Timecode':
        return Timecode(self._end - self._start)

    @duration.setter
    def duration(self, value: 'Timecode'):
        self._end = self._start + value._start

    def __int__(self) -> int:
        return self._start

    def __str__(self) -> str:
        if self._start != self._end:
            return self._ftime(self._start) + '~' + self._ftime(self._end)
        else:
            return self._ftime(self._start)

    def __repr__(self) -> str:
        return f'T({self})'

    def __call__(self, *args, **kwargs) -> 'Timecode':
        return Timecode(*args, **kwargs)

    def __neg__(self) -> 'Timecode':
        return Timecode(-self._start, -self._start + self.duration, self.name)

    def __add__(self, value: INPUT_TYPE) -> 'Timecode':
        offset, _ = self._parse(value)
        return Timecode(self._start + offset, self._end + offset, self.name)

    def __radd__(self, value: INPUT_TYPE) -> 'Timecode':
        return self + value

    def __sub__(self, value: INPUT_TYPE) -> 'Timecode':
        offset, _ = self._parse(value)
        return self + (-offset)

    def __rsub__(self, value: INPUT_TYPE) -> 'Timecode':
        return -self + value

    def __eq__(self, value: INPUT_TYPE) -> bool:
        if isinstance(value, str):
            start, _ = self._parse(value)
        elif value is None:
            return False
        else:
            start = int(value)

        return self._start == start

    def __contains__(self, value: INPUT_TYPE) -> bool:
        start, end = self._parse(value)

        if end != start:
            return start >= self._start and end <= self._end

        return self._start <= start <= self._end

    def __ge__(self, value: INPUT_TYPE) -> bool:
        start, _ = self._parse(value)
        return self._start >= start

    def __gt__(self, value: INPUT_TYPE) -> bool:
        start, _ = self._parse(value)
        return self._start > start

    def __le__(self, value: INPUT_TYPE) -> bool:
        start, _ = self._parse(value)
        return self._start <= start

    def __lt__(self, value: INPUT_TYPE) -> bool:
        start, _ = self._parse(value)
        return self._start < start


T = Timecode()


class Timecodes(SortedKeyList):
    NESTED_TYPE = Dict[str, Union[str, Dict[str, 'NESTED_TYPE'], List[str]]]

    INPUT_TYPE = Union[
        'Timecodes',
        List[Timecode.INPUT_TYPE],
        NESTED_TYPE
    ]

    STORE_TYPE = Union[Timecode, 'Timecodes']

    def __init__(self, data: INPUT_TYPE = None, name: str = None):
        super().__init__(key=lambda t: int(t))
        self.name = name

        if isinstance(data, Timecodes):
            self.update(data)
        elif isinstance(data, list):
            self.update(T(t) for t in data)
        elif isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, str):
                    self.add(Timecode(key, name=value))
                elif isinstance(value, (dict, list)):
                    self.add(Timecodes(value, name=key))
                else:
                    raise TypeError(type(data))
        elif data is not None:
            raise TypeError(type(data))

    def __new__(cls, *args, **kwargs) -> 'Timecodes':
        return object.__new__(cls)

    def add(self, t: STORE_TYPE):
        if isinstance(t, Timecodes) and t in self:
            t1 = [t2
                  for t2 in self
                  if t2.name == t.name and isinstance(t2, Timecodes)][0]
            t1.update(t)
            return

        return super().add(t)

    def transform(self, func: Callable[[Timecode],
                                       Union[Timecode, None]]) -> 'Timecodes':
        res = Timecodes(name=self.name)

        for t in self:
            if isinstance(t, Timecodes):
                new_t = t.transform(func)

                # Remove emptied lists
                if len(new_t) == 0:
                    continue

                res.add(new_t)
            else:
                start, end = func(t.start), func(t.end)

                if start is None:
                    start, end = end, None

                if start is None:
                    continue

                res.add(Timecode(start, end, t.name))

        # Collapse single nested dict
        if len(res) == 1:
            tmp = res[0]

            if isinstance(tmp, Timecodes) and not tmp.is_list:
                del res[0]
                [res.add(t1) for t1 in tmp]

        return res

    def filter(self, func: Callable[[Timecode], bool]) -> 'Timecodes':
        return self.transform(lambda t: t if func(t) else None)

    def __int__(self) -> int:
        return 0 if len(self) == 0 else int(self[0])

    def __contains__(self, value: STORE_TYPE) -> bool:
        if isinstance(value, Timecodes):
            for t in self:
                if isinstance(t, Timecodes) and t.name == value.name:
                    return True
        else:
            for t in self:
                if isinstance(t, Timecodes) and value in t:
                    return True
                elif t == value:
                    return True

        return False

    def __add__(self, offset: Timecode.INPUT_TYPE) -> 'Timecodes':
        return self.transform(lambda t: t + offset)

    def __sub__(self, offset: Timecode.INPUT_TYPE) -> 'Timecodes':
        return self + -Timecode(offset)

    @property
    def is_list(self):
        return not any(t.name or isinstance(t, Timecodes) for t in self)

    def to_list(self):
        return [str(tc) for tc in self]

    def to_dict(self) -> NESTED_TYPE:
        result = {}

        for t in self:
            if isinstance(t, Timecodes):
                if t.is_list:
                    result[t.name] = t.to_list()
                else:
                    result[t.name] = t.to_dict()
            else:
                result[str(t)] = t.name

        return result


TIMECODES_JSON = 'data/timecodes.json'


class TimecodesDatabase(Dict[str, Timecodes]):
    def __init__(self, filename: str = TIMECODES_JSON):
        self.filename = filename

        data: Dict[str, Timecodes.INPUT_TYPE] = load_json(filename)

        for key, value in data.items():
            self[key] = Timecodes(value)

    @join()
    def to_json(self):
        yield '{\n'

        first = True
        for key, value in natsorted(self.items(), key=lambda x: x[0]):
            if not first:
                yield ',\n'
            else:
                first = False

            yield f'  "{key}": '
            yield indent(json.dumps(value.to_dict(), indent=2, ensure_ascii=False), 2)[2:]

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
