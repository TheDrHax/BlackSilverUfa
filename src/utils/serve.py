import os
import sys
import asyncio
from subprocess import call, Popen
from watchgod import awatch


PYTHON = os.environ.get('PYTHON') or 'python3'
WATCH_LIST = [
    'data',
    'config',
    'src/data',
    'src/mako',
    'src/scripts',
    'src/utils',
    'src/config.py'
]


def generate():
    call([PYTHON, '-m', 'src.utils.generate'])


async def watch(path: str):
    async for changes in awatch(path):
        generate()


async def livereload():
    await asyncio.gather(*[watch(path) for path in WATCH_LIST])


def main():
    generate()

    webpack = Popen(['webpack', 'serve', '--host', '0.0.0.0'])

    try:
        asyncio.get_event_loop().run_until_complete(livereload())
    except KeyboardInterrupt or SystemExit:
        webpack.terminate()
        webpack.wait()
        sys.exit(0)


if __name__ == '__main__':
    main()
