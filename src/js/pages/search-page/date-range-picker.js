import React from 'react';
import PropTypes from 'prop-types';
// Components
import DatePicker from './date-picker';

const DateRangePicker = ({ startDate, endDate, minDate, onChange, ...rest }) => (
  <>
    <DatePicker
      key="startDate"
      value={startDate}
      minDate={minDate}
      onChange={(input) => onChange({ startDate: input, endDate })}
      {...rest}
    />
    <DatePicker
      key="endDate"
      value={endDate}
      minDate={startDate || minDate}
      onChange={(input) => onChange({ startDate, endDate: input })}
      {...rest}
    />
  </>
);

DateRangePicker.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
};

DateRangePicker.defaultProps = {
  startDate: null,
  endDate: null,
  minDate: null,
};

export default DateRangePicker;
