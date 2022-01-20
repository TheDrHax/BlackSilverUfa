import React from 'react';
import PropTypes from 'prop-types';
// Components
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const SimpleTooltip = ({ text, children }) => (
  <OverlayTrigger overlay={<Tooltip>{children}</Tooltip>}>
    <u className="d-inline-block">{text}</u>
  </OverlayTrigger>
);

SimpleTooltip.propTypes = {
  text: PropTypes.string.isRequired,
};

export default SimpleTooltip;
