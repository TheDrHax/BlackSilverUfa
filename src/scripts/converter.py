"""Usage:
  convert --all
  convert --stream <id> [<file>]

Options:
  --all     Get all filenames and styles from database. Without this argument
            converter will not change global style of subtitles.
  --stream  Same as --all, but converts only one stream.
"""

from multiprocessing import Pool

from docopt import docopt

from ..data.streams import streams
from ..utils.ass import convert_file


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    if args['--all']:
        tasks = [(s.subtitles_path, s.subtitles_style)
                 for s in streams.values()]
    elif args['--stream']:
        stream = streams[args['<id>']]
        if args['<file>']:
            tasks = [(args['<file>'], stream.subtitles_style)]
        else:
            tasks = [(stream.subtitles_path, stream.subtitles_style)]

    p = Pool(4)
    p.starmap(convert_file, tasks)
    p.close()


if __name__ == '__main__':
    main()
