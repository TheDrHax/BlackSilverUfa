import json
from typing import Dict, Union
from natsort import natsorted

from ...utils import join, indent, load_json
from ..timecodes import Timecodes


class TimecodesDatabase(Dict[str, Timecodes]):
    def __init__(self, filename: Union[str, None] = None):
        self.filename = filename

        if not filename:
            return

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
            yield indent(json.dumps(value.to_dict(),
                                    indent=2, ensure_ascii=False), 2)[2:]

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
