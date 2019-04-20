#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from ..utils import load_json
from .streams import Streams
from .games import Games
from .categories import Categories


config = load_json("data/config.json")
streams = Streams(load_json("data/streams.json"))
games = Games(streams, load_json("data/games.json"))
categories = Categories(streams, games, load_json("data/categories.json"))
