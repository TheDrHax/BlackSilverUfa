import re
from typing import List, Dict

from .config import config
from .timecodes import Timecode
from ..utils import join, json_escape
from ..utils.ass import SubtitlesEvent


class Blacklist:
    def __init__(self, users: List[str] = [], messages: List[str] = []):
        self._users = users
        self._messages = messages

        self.users = re.compile('^(' + '|'.join(users) + ')$', re.I)
        self.messages = re.compile('(' + '|'.join(messages) + ')', re.I)

    def __contains__(self, msg: SubtitlesEvent):
        return any([self.users.match(msg.username),
                    self.messages.match(msg.text)])

    def __add__(self, other: 'Blacklist') -> 'Blacklist':
        return Blacklist(self._users + other._users,
                         self._messages + other._messages)

    def __len__(self):
        return len(self._users) + len(self._messages)

    @join()
    def to_json(self):
        yield '{\n'
        
        users = False

        if len(self._users) > 0:
            users = True

            yield '  "users": [\n'

            first = True
            for user in self._users:
                if not first:
                    yield ',\n'
                else:
                    first = False

                yield f'    {json_escape(user)}'

            yield '\n  ]'
            
        if len(self._messages) > 0:
            if users:
                yield ',\n'

            yield '  "messages": [\n'

            first = True
            for message in self._messages:
                if not first:
                    yield ',\n'
                else:
                    first = False

                yield f'    {json_escape(message)}'

            yield '\n  ]'

        yield '\n}'


blacklist = Blacklist(**config['blacklist'])


class BlacklistTimeline:
    def __init__(self):
        self.blacklists = dict()

    def add(self, blacklist: Blacklist, start: Timecode, end: Timecode):
        self.blacklists[(start.value, end.value)] = blacklist

    def __contains__(self, msg: SubtitlesEvent):
        for (start, end), bl in self.blacklists.items():
            if start <= msg.start < end:
                return msg in bl

        return msg in blacklist
