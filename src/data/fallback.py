import re
import attr
from requests import Session
from bs4 import BeautifulSoup as BS
from cached_property import cached_property

from .config import config


req = Session()


@attr.s(auto_attribs=True)
class FallbackSource:
    prefix: str = attr.ib()
    capacity: int = 50
    parse_index: bool = True
    streams: bool = True
    chats: bool = True
    redirects: bool = False
    torrents: bool = False

    def __attrs_post_init__(self):
        self._check_cache = dict()

    @cached_property
    def index(self):
        res = req.get(f'{self.prefix}/',
                      allow_redirects=self.redirects)

        if res.status_code != 200:
            return None

        bs = BS(res.text, features="html.parser")
        links = bs.find_all('a', href=re.compile('\\.(mp4|ass|torrent)$'))

        result = list([link.attrs['href'].split('/')[-1] for link in links])
        return result if len(result) > 0 else None

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
        if self.parse_index and self.index:
            return filename in self.index

        return self._check(filename)

    def url(self, filename):
        return f'{self.prefix}/{filename}'


fallback = FallbackSource(**config['fallback'])
