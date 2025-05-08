import PropTypes from 'prop-types';

export const Segment = PropTypes.shape({
  segment: PropTypes.string,

  name: PropTypes.string,
  note: PropTypes.string,
  date: PropTypes.objectOf(Date),
  games: PropTypes.arrayOf(PropTypes.string),
  streams: PropTypes.arrayOf(PropTypes.string),
  offsets: PropTypes.objectOf(PropTypes.number),
  official: PropTypes.bool,

  youtube: PropTypes.string,
  direct: PropTypes.string,
  vk: PropTypes.string,
  hls: PropTypes.string,
  torrent: PropTypes.string,
  thumbnail: PropTypes.string,
  poster: PropTypes.string,
  url: PropTypes.string,

  abs_start: PropTypes.number,
  abs_end: PropTypes.number,
  duration: PropTypes.number,

  watched: PropTypes.number,
  setWatched: PropTypes.func,
});

export const SubRef = PropTypes.shape({
  name: PropTypes.string.isRequired,
  start: PropTypes.number,
});

export const SegmentRef = PropTypes.shape({
  name: PropTypes.string, // combined names of subrefs
  start: PropTypes.number, // from first subref
  segment: PropTypes.string,
  original: Segment,
  url: PropTypes.string,
  subrefs: PropTypes.arrayOf(SubRef),
});

export const Game = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  category: PropTypes.string,
  streams: PropTypes.arrayOf(SegmentRef),
  url: PropTypes.string,
});

// Hmm...
Segment.subrefs = PropTypes.arrayOf(SubRef);
SegmentRef.game = Game;
SubRef.parent = SegmentRef;

export const Category = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
});

export const IndexEntry = PropTypes.shape({
  name: PropTypes.string,
  segment: PropTypes.string,
  start: PropTypes.number,
  category: Category,
  original: Game,
  segments: PropTypes.arrayOf(Segment),
  url: PropTypes.string,
  streams: PropTypes.number,
  date: PropTypes.objectOf(Date),
});
