#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
from ..utils import _


class Cache(object):
    def __init__(self, filename):
        self.filename = filename
        self.data = dict()
        self._load()

    def _load(self):
        if os.path.isfile(self.filename):
            with open(self.filename, 'r') as f:
                self.data = json.load(f)

    def _save(self):
        with open(self.filename, 'w') as f:
            json.dump(self.data, f, indent=2, sort_keys=True)

    def __contains__(self, key):
        return key in self.data.keys()

    def set(self, key, value):
        self.data[key] = value
        self._save()

    def get(self, key):
        if key in self:
            return self.data[key]
        else:
            return None

    def remove(self, key):
        if key in self:
            del self.data[key]
            self._save()


cache = Cache(_('data/cache.json'))


def cached(key_format):
    def decorator(func):
        def wrapped(*args, **kwargs):
            key = key_format.format(args)
            if key in cache:
                return cache.get(key)
            else:
                value = func(*args, **kwargs)
                cache.set(key, value)
                return value
        return wrapped
    return decorator
