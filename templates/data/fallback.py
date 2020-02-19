import re
import attr
import typing
from bs4 import BeautifulSoup as BS
from requests import Session


req = Session()


@attr.s(auto_attribs=True)
class FallbackSource:
    prefix: str = None
    capacity: int = 50
    parse_index: bool = True
    streams: bool = True
    chats: bool = True
    redirects: bool = False
    torrents: bool = False

    index: typing.List[str] = attr.ib(init=False, repr=False)

    def __attrs_post_init__(self):
        self._check_cache = dict()

        if self.parse_index:
            self.index = self._index()
        else:
            self.index = None

    def _index(self):
        res = req.get(f'{self.prefix}/',
                      allow_redirects=self.redirects)

        if res.status_code != 200:
            return None

        bs = BS(res.text, features="html.parser")
        links = bs.find_all('a', href=re.compile('\\.(mp4|ass|torrent)$'))

        return list([link.attrs['href'].split('/')[-1] for link in links])

    def _check(self, filename):
        if filename in self._check_cache:
            return self._check_cache['filename']

        result = req.head(
            f'{self.prefix}/{filename}',
            allow_redirects=self.redirects
        ).status_code == 200

        self._check_cache[filename] = result
        return result

    def __contains__(self, filename):
        if self.index:
            return filename in self.index

        return self._check(filename)

    def url(self, filename):
        return f'{self.prefix}/{filename}'
