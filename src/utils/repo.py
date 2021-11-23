"""Usage:
  repo [pages | data] (status | fetch | push)
  repo [pages | data] (pull | checkout | prune) [--force] [<path>]
  repo [pages | data] commit <msg>

Options:
  --force     Ignore uncommitted changes in protected worktrees.

Status colors:
  ⚫️    Optional
  🔴    Not mounted
  🟢    Mounted
  🟡    Uncommitted changes
"""

import os
import sys
import git
import attr
import shutil

from docopt import docopt
from typing import Dict, List, Union

from ..config import config, convert_path


repo: git.Repo = git.Repo()


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
        if self.name in repo.remotes and self.name != repo.remote().name:
            print(f'Removing remote {self.name}')
            git.Remote.remove(repo, self.name)


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

        r.git.reset('--hard', self.ref)
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


def get_worktrees() -> List[Worktree]:
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
        options = options.copy()
        options['path'] = path
        options['remote'] = remotes[options['remote']]
        worktrees.append(Worktree(**options))

    return worktrees


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    repo.git.worktree('prune')

    worktrees = get_worktrees()

    if args['pages']:
        prefix = convert_path('$PREFIX')
        worktrees = filter(lambda wt: wt.path.startswith(prefix), worktrees)
    elif args['data']:
        worktrees = filter(lambda wt: wt.path == 'data', worktrees)

    if args['<path>']:
        worktrees = filter(lambda wt: wt.path.startswith(args['<path>']), worktrees)
    elif args['pull'] or args['fetch'] or args['checkout']:
        worktrees = filter(lambda wt: wt.is_mounted or not wt.optional, worktrees)

    worktrees = list(worktrees)

    if args['status']:
        for wt in worktrees:
            status = '🔴'

            if wt.is_mounted:
                r = wt.repo()

                if r.is_dirty() or r.untracked_files:
                    status = '🟡'
                else:
                    status = '🟢'
            elif wt.optional:
                status = '⚫️'

            print(f'{status} {wt.path} ({wt.local_branch})')

    if args['pull'] or args['fetch']:
        for wt in worktrees:
            wt.fetch()

    if args['pull'] or args['checkout'] or args['prune']:
        for wt in worktrees:
            if wt.is_mounted and wt.protected and not args['--force']:
                r = wt.repo()

                if r.is_dirty() or r.untracked_files:
                    print(f'{wt.path} has uncommitted changes')
                    continue

            if args['prune']:
                wt.prune()
            else:
                wt.update()

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

            if r.is_dirty() or r.untracked_files:
                r.git.add('.')
                r.index.commit(args['<msg>'])
            else:
                print(f'{wt.path}: Nothing to commit')

    if args['push']:
        for wt in worktrees:
            wt.push()


if __name__ == '__main__':
    main()
