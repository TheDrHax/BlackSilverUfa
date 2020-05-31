import os
import sys
from subprocess import call
from livereload import Server

from . import _


python = os.environ.get('PYTHON') or 'python3'


def generate():
    return call([python, '-m', 'src.utils.generate', *sys.argv[1:]])


def serve(host='0.0.0.0', port=8000, root=_('')):
    server = Server()

    server.watch('data', generate)
    server.watch('static', generate)
    server.watch('src', generate)

    generate()
    server.serve(host=host, port=port, root=root)


if __name__ == '__main__':
    serve()
