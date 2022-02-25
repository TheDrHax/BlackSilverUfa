import PropTypes from 'prop-types';

export const TypeMessage = PropTypes.shape({
  $loki: PropTypes.number, // unique id
  time: PropTypes.number,
  user: PropTypes.string,
  text: PropTypes.string,
  color: PropTypes.string,
  hidden: PropTypes.bool,
});

export const TypeEmotes = PropTypes.shape({
  pattern: PropTypes.object,
  data: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string,
    src: PropTypes.string,
  })),
});
