import PropTypes from 'prop-types';

export const TypeMessage = PropTypes.shape({
  $loki: PropTypes.number, // unique id
  time: PropTypes.number,
  user: PropTypes.string,
  text: PropTypes.string,
  color: PropTypes.string,
  hidden: PropTypes.bool,
});
