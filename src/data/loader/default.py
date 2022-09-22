from .streams import Streams
from .games import Games
from .categories import Categories
from .timecodes import TimecodesDatabase
from .version import check_data_version


TIMECODES_JSON = 'data/timecodes.json'
STREAMS_JSON = 'data/streams.json'
STREAMS_META_JSON = 'data/streams-meta.json'
GAMES_JSON = 'data/games.json'
CATEGORIES_JSON = 'data/categories.json'


check_data_version()


timecodes = TimecodesDatabase(TIMECODES_JSON)
streams = Streams(timecodes, STREAMS_JSON, STREAMS_META_JSON)
games = Games(streams, GAMES_JSON)
categories = Categories(games, CATEGORIES_JSON)
