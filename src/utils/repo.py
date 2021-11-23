"""Usage:
  repo [options] [pages | data] status
  repo [options] [pages | data] fetch
  repo [options] [pages | data] push
  repo [options] [pages | data] pull
  repo [options] [pages | data] checkout
  repo [options] [pages | data] prune
  repo [options] [pages | data] commit <msg>

Options:
  --overwrite-protected     Ignore uncommitted changes in protected worktrees.
"""

import os
import sys
import git
import attr
import shutil

from docopt import docopt
from typing import Dict, List, Union

from ..config import config


repo: git.Repo = git.Repo()


def convert_path(path: str) -> str:
    parts = path.replace('$PREFIX', os.environ['PREFIX']).split('/')
    return os.path.join(*parts)


@attr.s(auto_attribs=True, kw_only=True)
class Remote:
    name: str = attr.ib()
    pull: str = attr.ib()
    push: str = attr.ib()

    def update(self):
        if self.name not in repo.remotes:
            remote = repo.create_remote(self.name, self.pull)
        else:
            remote = self.get()

        if self.push != repo.git.remote('get-url', '--push', self.name):
            repo.git.remote('set-url', '--push', self.name, self.push)

        if self.pull != list(remote.urls)[0]:
            repo.git.remote('set-url', self.name, self.pull)

    def get(self) -> git.Remote:
        return repo.remotes[self.name]

    def prune(self):
        if self.name in repo.remotes:
            print(f'Removing remote {self.name}')
            repo.remotes.remove(self.get())


@attr.s(auto_attribs=True, kw_only=True)
class Worktree:
    path: str = attr.ib(converter=convert_path)
    remote: Remote = attr.ib()
    branch: str = attr.ib()
    prefix: Union[str, None] = None
    optional: bool = False
    protected: bool = False

    @property
    def local_branch(self) -> str:
        if self.remote.name == repo.remote().name:
            return self.branch
        else:
            return self.remote.name

    @property
    def ref(self) -> str:
        return f'{self.remote.name}/{self.branch}'

    @property
    def is_mounted(self) -> bool:
        return os.path.exists(os.path.join(self.path, '.git'))

    def repo(self) -> git.Repo:
        return git.Repo(self.path)

    def fetch(self):
        print(f'Fetching updates for {self.ref}')
        self.remote.update()
        repo.git.fetch(self.remote.name, self.branch)

    def update(self, force: bool = False):
        print(f'Updating {self.path}')

        if force or not self.is_mounted and os.path.exists(self.path):
            shutil.rmtree(self.path)
            repo.git.worktree('prune')

        if not self.is_mounted:
            os.makedirs(self.path)
            repo.git.worktree('add', self.path, self.ref)

        r = self.repo()

        r.git.reset('--hard')
        r.git.clean('-d', '-f')
        r.git.checkout('-B', self.local_branch)
        r.git.branch('--set-upstream-to', self.ref, self.local_branch)

    def push(self):
        self.remote.update()
        r = self.repo()
        r.git.push(self.remote.name, f'HEAD:{self.branch}')

    def prune(self):
        if self.is_mounted:
            print(f'Unmounting {self.path}')

        if os.path.exists(self.path):
            shutil.rmtree(self.path)

        repo.git.worktree('prune')
        repo.branches.remove(repo.branches[self.local_branch])
        self.remote.prune()


def get_worktrees(selector: Union[str, None] = None) -> List[Worktree]:
    remotes: Dict[str, Remote] = dict()

    origin: str = repo.remote().name
    remotes[origin] = Remote(
        name=origin,
        pull=repo.git.remote('get-url', origin),
        push=repo.git.remote('get-url', '--push', origin))

    for remote_raw in config['repos']['remotes']:
        remote = Remote(**remote_raw)
        remotes[remote.name] = remote

    worktrees: List[Worktree] = list()

    for path, options in config['repos']['mounts'].items():
        if selector and not path.startswith(selector):
            continue

        options = options.copy()
        options['path'] = path
        options['remote'] = remotes[options['remote']]
        worktrees.append(Worktree(**options))

    return worktrees


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    repo.git.worktree('prune')

    if args['pages']:
        selector = '$PREFIX'
    elif args['data']:
        selector = 'data'
    else:
        selector = None

    worktrees = get_worktrees(selector)

    if args['status']:
        for wt in worktrees:
            status = '🔴'

            if wt.is_mounted:
                r = wt.repo()

                if r.is_dirty() or r.untracked_files:
                    status = '🟡'
                else:
                    status = '🟢'

            print(f'{status} {wt.path} ({wt.local_branch})')

    if args['pull'] or args['fetch']:
        for wt in worktrees:
            wt.fetch()

    if args['pull'] or args['checkout']:
        for wt in worktrees:
            if wt.is_mounted and wt.protected and not args['--overwrite-protected']:
                r = wt.repo()

                if (r.is_dirty or r.untracked_files):
                    print(f'Not updating {wt.path} due to uncommitted changes')
                    continue

            wt.update()

    if args['prune']:
        for wt in worktrees:
            wt.prune()

    if args['commit']:
        if not args['pages'] or args['data']:
            from ..data import check_data_version
            check_data_version()

        if args['pages'] and os.path.exists(convert_path('$PREFIX/.DEBUG')):
            print('Error: The site was generated with debug mode enabled.')
            print('Please rebuild it with "./bsu build" before committing.')
            sys.exit(1)

        for wt in worktrees:
            r = wt.repo()

            if r.is_dirty:
                r.git.add('.')
                r.index.commit(args['<msg>'])
            else:
                print(f'{wt.path}: Nothing to commit')

    if args['push']:
        for wt in worktrees:
            wt.push()


if __name__ == '__main__':
    main()
