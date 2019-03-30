#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from git import Repo
from datetime import datetime
from ..utils import _, load_json, last_line, count_lines
from .cache import cached
from .timecodes import Timecode, Timecodes, TimecodesSlice


repo = Repo('.')
config = load_json('data/config.json')
timecodes = load_json('data/timecodes.json')


class Segment(dict):
    @staticmethod
    def _escape_attr(attr):
        if type(attr) is str:
            return attr.replace('"', '&quot;')
        else:
            return str(attr)

    def __init__(self, segment, stream=None):
        super(Segment, self).__init__(segment)

        if 'segment' not in self:
            self['segment'] = 0

        if 'twitch' not in self:
            if stream is not None:
                self.stream = stream
                self['twitch'] = stream.twitch
            else:
                raise AttributeError('Missing attribute "twitch"')

        for key in ['start', 'end', 'offset']:
            if key in self:
                self[key] = Timecode(self[key])

        if type(self) is Segment:  # HACK: Filter out SegmentReference instances
            if True not in [key in self for key in ['youtube', 'vk', 'direct']]:
                if config.get('fallback_source'):
                    if self.get('offset'):
                        self['start'] = self['offset']
                        del self['offset']

                    base_url = config['fallback_source']
                    self['direct'] = f'{base_url}/{self["twitch"]}.mp4'

    def player_compatible(self):
        for field in ['youtube', 'vk', 'direct']:
            if field in self:
                return True
        return False

    def attrs(self):
        attrs = []

        def add(key, func = lambda x: x):
            if key in self:
                value = func(self[key])
                value = self._escape_attr(value)
                attrs.append(f'data-{key}="{value}"')

        if self['segment'] != 0:
            add('segment')

        add('offset', lambda x: int(x))

        for key in ['start', 'end']:
            add(key, lambda x: int(x - Timecode(self.get('offset'))))

        for key in ['name', 'twitch', 'youtube', 'vk', 'direct']:
            add(key)

        if not self.player_compatible():
            attrs.append('style="display: none"')

        return ' '.join(attrs)

    @property
    def date(self):
        return self.stream.date

    @property
    def hash(self):
        if self['segment'] == 0:
            return self['twitch']
        else:
            return self['twitch'] + '.' + str(self['segment'])

    def thumbnail(self):
        if 'youtube' in self:
            id = self['youtube']
            return f'https://img.youtube.com/vi/{id}/mqdefault.jpg'
        elif 'vk' in self:
            id = self['vk']
            return f'https://api.thedrhax.pw/vk/video/{id}.jpg'
        else:
            return '/static/images/no-preview.png'

    def mpv_file(self):
        if 'youtube' in self:
            return 'ytdl://' + self['youtube']
        elif 'vk' in self:
            return f'https://api.thedrhax.pw/vk/video/{self["vk"]}.mp4'
        elif 'direct' in self:
            return self['direct']

    def mpv_args(self):
        base_url = 'https://blackufa.thedrhax.pw'
        res = f'--sub-file={base_url}/chats/v{self["twitch"]}.ass '
        offset = Timecode(0)
        if 'offset' in self:
            offset = Timecode(self['offset'])
            res += f'--sub-delay={-int(offset)} '
        if 'start' in self:
            res += f'--start={int(Timecode(self["start"]) - offset)} '
        if 'end' in self:
            res += f'--end={int(Timecode(self["end"]) - offset)} '
        return res.strip()


class Stream(list):
    def __init__(self, segments, key):
        if type(segments) is not list:
            raise TypeError(type(segments))

        self.twitch = key
        self.games = []

        if key in timecodes:
            self.timecodes = Timecodes(timecodes[key])
        else:
            self.timecodes = Timecodes()

        for segment in segments:
            self.append(segment)

    @property
    @cached('length-{0[0].twitch}')
    def _length(self):
        line = last_line(_(f'chats/v{self.twitch}.ass'))
        if line is not None:
            return int(Timecode(line.split(' ')[2].split('.')[0]))

    @property
    def length(self):
        return Timecode(self._length)

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
    @cached('messages-{0[0].twitch}')
    def _messages(self):
        lines = count_lines(_(f'chats/v{self.twitch}.ass'))
        return (lines - 10) if lines else None

    @property
    def messages(self):
        return self._messages or 0

    def append(self, data):
        segment = Segment(data, self)
        super(Stream, self).append(segment)

        if len(self.timecodes) > 0:
            segment['timecodes'] = TimecodesSlice(self.timecodes)
            if 'offset' in segment:
                segment['timecodes'].start_at(segment['offset'])
                if self.index(segment) > 0:
                    prev = self[self.index(segment) - 1]
                    prev['timecodes'].end_at(segment['offset'])
            
            if 'end' in segment:
                end = segment['end']
                if 'offset' in segment:
                    end += segment['offset']
                segment['timecodes'].end_at(end)


class Streams(dict):
    def _from_dict(self, streams):
        for id, stream in streams.items():
            if type(stream) is dict:
                self[id] = Stream([stream], id)
            elif type(stream) is list:
                self[id] = Stream(stream, id)
            else:
                raise TypeError

    def _from_list(self, streams):
        for stream in streams:
            id = stream['twitch']
            self[id] = Stream([stream], id)

    def __init__(self, streams):
        if type(streams) is dict:
            self._from_dict(streams)
        elif type(streams) is list:
            self._from_list(streams)
        else:
            raise TypeError(type(streams))
