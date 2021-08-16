import React from 'react';
import PropTypes from 'prop-types';
// Components
import DatePicker from 'react-date-picker';
import { Form } from 'react-bootstrap';
// Namespace
import { SCALES } from './constants';

const DatePickerComponent = ({ scale, ...rest }) => (
  <Form.Control
    as={DatePicker}
    minDetail="decade"
    locale="ru-RU"
    maxDetail={scale}
    showLeadingZeros
    {...rest}
  />
);

DatePickerComponent.propTypes = {
  scale: PropTypes.oneOf(SCALES).isRequired,
  value: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date).isRequired,
  maxDate: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
  tileClassName: PropTypes.func,
  tileContent: PropTypes.func,
};

DatePickerComponent.defaultProps = {
  value: null,
  tileClassName: null,
  tileContent: null,
};

export default DatePickerComponent;
