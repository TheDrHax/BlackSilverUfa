#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from .timecodes import Timecode, Timecodes


class Segment(dict):
    @staticmethod
    def _escape_attr(attr):
        if type(attr) is str:
            return attr.replace('"', '&quot;')
        else:
            return str(attr)

    def __init__(self, segment, key=None):
        super(Segment, self).__init__(segment)

        if 'segment' not in self:
            self['segment'] = 0

        if 'twitch' not in self:
            if key:
                self['twitch'] = key
            else:
                raise AttributeError('Missing attribute "twitch"')

        for key in ['start', 'soft_start', 'end', 'offset']:
            if key in self:
                self[key] = Timecode(self[key])

        if 'timecodes' in self:
            timecodes = self['timecodes']
            self['timecodes'] = Timecodes(timecodes)

    def player_compatible(self):
        for field in ['youtube', 'vk', 'direct']:
            if field in self:
                return True
        return False

    def attrs(self):
        attrs = []

        def add(key, value):
            attrs.append('data-{}="{}"'.format(key, self._escape_attr(value)))

        for key in self.keys():
            if key in ['note', 'timecodes']:
                continue

            if key == 'segment':
                if self['segment'] != 0:
                    add(key, self[key])
                continue

            add(key, self[key])

        if not self.player_compatible():
            attrs.append('style="display: none"')

        return ' '.join(attrs)

    @property
    def hash(self):
        if self['segment'] == 0:
            return self['twitch']
        else:
            return self['twitch'] + '.' + str(self['segment'])

    def thumbnail(self):
        if 'youtube' in self:
            id = self['youtube']
            return 'https://img.youtube.com/vi/{}/mqdefault.jpg'.format(id)
        elif 'vk' in self:
            id = self['vk']
            return 'https://api.thedrhax.pw/vk/video/{}.jpg'.format(id)
        else:
            return '/static/images/no-preview.png'

    def mpv_file(self):
        if 'youtube' in self:
            return 'ytdl://' + self['youtube']
        elif 'vk' in self:
            return 'https://api.thedrhax.pw/vk/video/{}.mp4'.format(self['vk'])
        elif 'direct' in self:
            return self['direct']

    def mpv_args(self):
        sub_format = '--sub-file=https://blackufa.thedrhax.pw/chats/v{}.ass '
        result = sub_format.format(self['twitch'])
        offset = Timecode(0)
        if 'offset' in self:
            offset = Timecode(self['offset'])
            result += '--sub-delay={} '.format(-int(offset))
        if 'start' in self:
            start = int(Timecode(self['start']) - offset)
            result += '--start={} '.format(start)
        if 'end' in self:
            result += '--end={} '.format(int(Timecode(self['end']) - offset))
        return result.strip()


class Stream(list):
    def __init__(self, segments, key):
        if type(segments) is not list:
            raise TypeError(type(segments))

        self.twitch = key
        for segment in segments:
            self.append(Segment(segment, key))


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
