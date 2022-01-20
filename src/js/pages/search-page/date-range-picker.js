import React from 'react';
import PropTypes from 'prop-types';
// Components
import DatePicker from './date-picker';

const DateRangePicker = ({ from, to, minDate, onChange, ...rest }) => (
  <>
    <DatePicker
      key="from"
      value={from}
      minDate={minDate}
      onChange={(input) => onChange({ from: input, to })}
      {...rest}
    />
    <DatePicker
      key="to"
      value={to}
      minDate={from || minDate}
      onChange={(input) => onChange({ from, to: input })}
      {...rest}
    />
  </>
);

DateRangePicker.propTypes = {
  from: PropTypes.instanceOf(Date),
  to: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
};

DateRangePicker.defaultProps = {
  from: undefined,
  to: undefined,
  minDate: null,
};

export default DateRangePicker;
