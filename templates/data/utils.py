#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json


def load_json(filename):
    with open(filename, "r") as f:
        return json.load(f)
