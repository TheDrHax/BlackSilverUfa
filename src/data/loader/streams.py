import attr
from natsort import natsorted
from typing import Dict, Union

from ..fallback import fallback
from ..timecodes import Timecode, Timecodes
from ...utils import load_json, join, indent
from ..streams import Stream
from .timecodes import TimecodesDatabase


@attr.s(auto_attribs=True)
class Segments:
    streams: 'Streams' = attr.ib()

    def __iter__(self):
        for stream in self.streams.values():
            for segment in stream:
                yield segment

    @join()
    def to_json(self, compiled=False):
        yield '{\n'

        first = True
        for s in self:
            if not first:
                yield ',\n'
            else:
                first = False

            yield f'  "{s.hash}": {indent(s.to_json(compiled), 2)[2:]}'

        yield '\n}'

    def save(self, filename: str, compiled=False):
        data = self.to_json(compiled)

        with open(filename, 'w') as fo:
            fo.write(data)
            fo.write('\n')


class Streams(Dict[str, Stream]):
    def __init__(self, timecodes: Union[TimecodesDatabase, None] = None,
                 streams_json: Union[str, None] = None,
                 meta_json: Union[str, None] = None):
        self.filename = streams_json

        if not streams_json:
            return

        if not timecodes:
            timecodes = TimecodesDatabase()

        streams = load_json(streams_json)

        if meta_json:
            metadata = load_json(meta_json)
            meta = metadata.get('default') or {}
        else:
            metadata = {}
            meta = {}

        for twitch_id, stream in streams.items():
            meta = dict(meta)

            if twitch_id in metadata:
                meta.update(metadata[twitch_id])

            if isinstance(stream, dict):
                stream = [stream]

            if not isinstance(stream, list):
                raise TypeError(type(stream))

            if 'source_cuts' in stream[0]:
                cuts = stream[0].pop('source_cuts')
            else:
                cuts = []

            if ',' in twitch_id:
                targets = list([self[key] for key in twitch_id.split(',')])
            else:
                targets = []

            self[twitch_id] = Stream(data=stream, key=twitch_id,
                                     streams=targets, meta=meta,
                                     timecodes=timecodes.get(twitch_id),
                                     cuts=cuts)

    def enable_fallbacks(self):
        items = list(self.items())

        if not fallback.index:
            items = items[-fallback.capacity:]

        hls_suffix = fallback.hls_proxy_suffix

        for key, stream in items:
            if fallback.streams and False in [s.playable for s in stream]:
                filename = f'{stream.twitch}.mp4'
                if filename in fallback:
                    for segment in stream:
                        if not segment.playable:
                            segment.fallbacks['direct'] = segment.direct
                            segment.direct = fallback.url(filename)
                            if hls_suffix:
                                segment.fallbacks['hls'] = segment.hls
                                segment.hls = f'{segment.direct}{hls_suffix}'
                            segment.fallbacks['cuts'] = segment.cuts
                            segment.cuts = Timecodes()
                            segment.fallbacks['offset'] = segment.offset()
                            segment.offset = Timecode(0)

            if fallback.torrents and None in [s.torrent for s in stream]:
                filename = f'{stream.twitch}.torrent'
                if filename in fallback:
                    for segment in stream:
                        if segment.torrent is None:
                            segment.fallbacks['torrent'] = segment.torrent
                            segment.torrent = fallback.url(filename)
        
        for stream, vk in fallback.vk.items():
            if stream not in self:
                continue

            for segment in self[stream]:
                if not segment.vk:
                    segment.fallbacks['vk'] = segment.vk
                    segment.vk = vk

    @property
    def segments(self):
        return Segments(self)

    @join()
    def to_json(self):
        yield '{\n'

        def sort_key(item):
            key = item[0]
            if ',' in key:  # place joined streams after the last part
                return key.split(',')[-1] + '_'
            return key

        first = True
        for key, stream in natsorted(self.items(), key=sort_key):
            if not first:
                yield ',\n'
            else:
                first = False

            yield f'  "{key}": {indent(stream.to_json(), 2)[2:]}'

        yield '\n}'

    def __str__(self):
        return self.to_json()

    def save(self, filename: Union[str, None] = None):
        if filename is None:
            if self.filename is None:
                raise ValueError

            filename = self.filename

        data = self.to_json()

        with open(filename, 'w') as fo:
            fo.write(data)
            fo.write('\n')
