import json
from typing import Any, Dict, List, Union
from flask import Flask, request
from ..data.streams import Stream
from ..data.timecodes import Timecodes


app = Flask(__name__)


@app.post('/api/timecodes/transform')
def timecodes():
    data: Dict[str, Any] = request.json

    segment: Dict[str, Any] = data.get('segment')
    timecodes: Union[Timecodes.INPUT_TYPE,
                     List[Timecodes.INPUT_TYPE]] = data.get('timecodes')

    if isinstance(timecodes, dict):
        data = {
            'offset': segment.get('offset'),
            'cuts': segment.get('cuts'),
        }

        stream = Stream(key='1', data=[data], timecodes=Timecodes(timecodes))
    elif isinstance(timecodes, list):
        streams = []

        for i, ts_raw in enumerate(timecodes):
            ts = Timecodes(ts_raw)
            streams.append(Stream(data=[{}], key=str(i), timecodes=ts))

        stream_id = ','.join([s.twitch for s in streams])
        data = {
            'offsets': segment.get('offsets'),
            'cuts': segment.get('cuts')
        }

        stream = Stream(data=[data], key=stream_id, streams=streams)
    else:
        raise ValueError

    result = stream[0].timecodes.to_dict()
    headers = {'content-type': 'application/json'}
    return json.dumps(result, ensure_ascii=False, indent=2), headers
