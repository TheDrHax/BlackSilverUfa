#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from subprocess import call
from livereload import Server

from . import _


def generate():
    return call(['python', '-m', 'templates.utils.generate'])


def serve(host='0.0.0.0', port=8000, root=_('')):
    server = Server()

    server.watch('data', generate)
    server.watch('static', generate)
    server.watch('templates', generate)
    server.watch('generate.py', generate)

    generate()
    server.serve(host=host, port=port, root=root)


if __name__ == '__main__':
    serve()
