import PropTypes from 'prop-types';

export const Segment = PropTypes.shape({
  segment: PropTypes.string,

  name: PropTypes.string,
  note: PropTypes.string,
  date: PropTypes.objectOf(Date),
  games: PropTypes.arrayOf(PropTypes.string),
  streams: PropTypes.arrayOf(PropTypes.string),
  official: PropTypes.bool,

  youtube: PropTypes.string,
  direct: PropTypes.string,
  torrent: PropTypes.string,
  thumbnail: PropTypes.string,
  url: PropTypes.string,

  abs_start: PropTypes.number,
  abs_end: PropTypes.number,
  duration: PropTypes.number,
});

export const SegmentRef = PropTypes.shape({
  name: PropTypes.string,
  start: PropTypes.number,
  segment: PropTypes.string,
  original: Segment,
  url: PropTypes.string,
});

export const Game = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  category: PropTypes.string,
  streams: PropTypes.arrayOf(SegmentRef),
});

SegmentRef.game = Game; // Hmm...

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