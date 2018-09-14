#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from ..utils import load_json
from .streams import Streams
from .games import Games
from .categories import Categories


streams = Streams(load_json("data/streams.json"))
games = Games(streams, load_json("data/games.json"))
categories = Categories(games, load_json("data/categories.json"))
