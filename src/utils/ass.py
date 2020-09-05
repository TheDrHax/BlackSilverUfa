from typing import List
from math import floor


class EmptyLineError(Exception):
    pass


class SubtitlesEvent(dict):
    @staticmethod
    def _ptime(t: str) -> float:
        hours, minutes, seconds = map(float, t.split(':'))
        return hours * 3600 + minutes * 60 + seconds

    @staticmethod
    def _ftime(t: float) -> str:
        """Converts float to ASS timestamp. Supports more than 24 hours."""

        # Attempt to copy weird rounding of datetime and timedelta
        t = floor(round(t + 0.000001, 6) * 100) / 100

        hours = int(t // 3600)
        t %= 3600
        minutes = str(int(t // 60)).zfill(2)
        t %= 60
        seconds = format(t, '.2f').zfill(5)

        return f'{int(hours)}:{minutes}:{seconds}'

    @property
    def start(self) -> float:
        return self._ptime(self['Start'])

    @start.setter
    def start(self, value: float):
        self['Start'] = self._ftime(value)

    @property
    def end(self) -> float:
        return self._ptime(self['End'])

    @end.setter
    def end(self, value: float):
        self['End'] = self._ftime(value)

    @property
    def duration(self) -> float:
        return self.end - self.start

    @duration.setter
    def duration(self, value: float):
        self.end = self.start + value

    @property
    def color_bgr(self):
        username = self['Text'].split(': ', 1)[0]
        if username.startswith('{\\c&H'):
            return username[5:11]
        else:
            return None

    @property
    def username(self):
        username = self['Text'].split(': ', 1)[0]
        if self.color_bgr:
            username = username[13:len(username)-13]
        return username

    @property
    def text(self):
        return self['Text'].split(': ', 1)[1]

    @text.setter
    def text(self, value):
        username = self['Text'].split(': ', 1)[0]
        self['Text'] = f'{username}: {value}'

    def __init__(self, line, event_format):
        self.format = event_format

        msg = line[10:].split(', ', len(event_format) - 1)
        super().__init__(zip(event_format, msg))

        try:
            self.text
        except Exception:
            raise EmptyLineError()

    def compile(self, event_format: List[str] = None):
        if not event_format:
            event_format = self.format

        return 'Dialogue: ' + ', '.join([self[key] for key in event_format])


class SubtitlesStyle(dict):
    def __init__(self, format_line: str, style_line: str):
        if format_line.startswith('Format: '):
            format_line = format_line[8:].strip()

        if style_line.startswith('Style: '):
            style_line = style_line[7:].strip()

        self.format = list([field.strip() for field in format_line.split(',')])
        style = list([field.strip() for field in style_line.split(',')])
        self.update(zip(self.format, style))

    def compile(self) -> str:
        return 'Style: ' + ', '.join(self.values())


class SubtitlesReader:
    @staticmethod
    def __iter_file(f):
        for line in f:
            yield line.strip()

    def __init__(self, fi: str):
        self.file = open(fi, 'r')
        self._iter = self.__iter_file(self.file)

        self.header = []
        self.style = None
        self.event_format = None

        style_section = False
        style_format = None

        event_section = False

        while True:
            line = self._iter.__next__()

            if not style_section and line.startswith('[V4 Styles]'):
                style_section = True

            if style_section and not self.style:
                if line.startswith('Format: '):
                    style_format = line
                elif line.startswith('Style: '):
                    self.style = SubtitlesStyle(style_format, line)

            if not event_section and line.startswith('[Events]'):
                style_section = False
                event_section = True

            if event_section:
                if line.startswith('Format: '):
                    self.event_format = line[8:].split(', ')
                    break

            if not style_section and not event_section:
                self.header.append(line)

    def close(self):
        self.file.close()

    def events(self):
        for line in self._iter:
            yield SubtitlesEvent(line, self.event_format)


class SubtitlesWriter:
    def __init__(self, fo, header: List[str], style: SubtitlesStyle,
                 event_format: List[str]):
        self.file = open(fo, 'w')
        self.style = style
        self.event_format = event_format

        self.file.writelines([
            '\n'.join(header) + '\n',
            '[V4 Styles]\n',
            'Format: ' + ', '.join(style.format) + '\n',
            style.compile() + '\n\n',
            '[Events]\n',
            'Format: ' + ', '.join(event_format) + '\n'
        ])

    def write(self, event: SubtitlesEvent):
        self.file.write(event.compile(self.event_format) + '\n')

    def close(self):
        self.file.close()
