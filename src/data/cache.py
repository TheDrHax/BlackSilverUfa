import os
import json
from typing import Callable, Union
from functools import wraps

from typing_extensions import override
from ..utils import _


class Cache:
    def __init__(self):
        self.data = {}
        self.accessed = set()

    def set(self, key, value):
        self.data[key] = value
    
    def get(self, key):
        self.accessed.add(key)
        return self.data.get(key)

    def __contains__(self, key):
        self.accessed.add(key)
        return key in self.data
    
    def remove(self, key):
        self.accessed.discard(key)

        if key in self.data:
            del self.data[key]
            return True

        return False

    def prune(self):
        removed = self.data.keys() - self.accessed

        for key in removed:
            del self.data[key]

        self.accessed.clear()

        return removed


class DiskCache(Cache):
    def _load(self):
        if os.path.isfile(self.filename):
            with open(self.filename, 'r') as f:
                self.data = json.load(f)

    def _save(self):
        with open(self.filename, 'w') as f:
            json.dump(self.data, f,
                      indent=2,
                      sort_keys=True,
                      ensure_ascii=False)

    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        self.data = {}
        self.accessed = set()
        self._load()

    @override
    def set(self, key, value):
        super().set(key, value)
        self._save()
    
    @override
    def remove(self, key):
        if super().remove(key):
            self._save()
            return True
        return False

    @override
    def prune(self):
        removed = super().prune()

        if removed:
            self._save()

        return removed


cache = DiskCache(_('data/cache.json'))


HASH_SUFFIX = '--hash'


def cached(key_format: str,
           hash_func: Union[Callable[..., str], None] = None,
           store: Union[Cache, None] = cache):

    if store is None:
        store = Cache()

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = key_format.format(args)
            value = store.get(key)
            prev_hash = store.get(key + HASH_SUFFIX)

            try:
                assert hash_func is not None
                curr_hash = hash_func(*args, **kwargs)
            except Exception:
                curr_hash = None

            if value is not None:
                if curr_hash == prev_hash and prev_hash is not None:
                    return value
                
                if curr_hash is None:
                    return value

            value = func(*args, **kwargs)

            if value is not None:
                store.set(key, value)

                if curr_hash is not None:
                    store.set(key + HASH_SUFFIX, curr_hash)

            return value

        return wrapper

    return decorator
