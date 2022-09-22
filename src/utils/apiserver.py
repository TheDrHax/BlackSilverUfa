import json
from typing import Any, Dict
from flask import Flask, request
from ..data.streams import Segment, Stream
from ..data.timecodes import Timecodes


app = Flask(__name__)


@app.post('/api/timecodes/transform')
def timecodes():
    data: Dict[str, Any] = request.json

    ts = Timecodes(data.get('timecodes') or {})
    segment_kwargs = data.get('segment') or {}

    stream = Stream(data=[], key='4221', timecodes=ts)
    segment = Segment(stream=stream, **segment_kwargs)

    headers = {'content-type': 'application/json'}
    result = segment.timecodes.to_dict()
    return json.dumps(result, ensure_ascii=False, indent=2), headers
