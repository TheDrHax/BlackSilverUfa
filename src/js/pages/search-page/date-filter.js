import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Components
import { InputGroup, Col, Button } from 'react-bootstrap';
import Dropdown from './dropdown';
import DateRangePicker from './date-range-picker';
import DatePicker from './date-picker';
// Namespace
import { searchPage as t } from '../../constants/texts';
import { SCALES } from './constants';
// Utils
import Sugar from '../../utils/sugar';
import { getStreamsLabel } from './utils';

const getRange = (date, scale) => {
  if (!date) {
    return [];
  }

  const startDate = new Date(date);

  if (scale === 'year') {
    Sugar.Date.reset(startDate, 'month');
  } else if (scale === 'decade') {
    Sugar.Date.reset(startDate, 'year');
  }

  const endDate = new Date(startDate);
  if (scale === 'year') {
    Sugar.Date.advance(endDate, { months: 1 });
  } else if (scale === 'decade') {
    Sugar.Date.advance(endDate, { years: 1 });
  }

  Sugar.Date.rewind(endDate, { days: 1 });

  return [startDate, endDate];
};

const getIntervalSummary = ({ date, view, segments, maxDate }) => {
  if (date > maxDate) return null;

  const range = getRange(date, view);
  const count = segments.count({ date: { $between: range } });
  return (<div>{getStreamsLabel(count)}</div>);
};

const getDayClassName = ({ date, segments }) => {
  const count = segments.count({ date: { $dteq: date } });
  return (count ? 'bg-lightgreen' : 'bg-lightcoral');
};

const DEFAULT_SCALE = 'year';

const DateFilter = ({ startDate, endDate, segments, onChange, ...rest }) => {
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [date, setDate] = useState();

  const minDate = new Date(segments.min('date'));
  const maxDate = new Date(segments.max('date'));

  const datePickerConfig = { scale, minDate, maxDate };
  const resetDates = () => {
    setDate(null);
    onChange({ startDate: null, endDate: null });
  };

  return (
    <InputGroup as={Col} {...rest}>
      <InputGroup.Prepend>
        <Dropdown
          value={scale}
          variant="dark"
          options={SCALES}
          labels={t.scales}
          onChange={(input) => {
            resetDates();
            setScale(input);
          }}
        />
      </InputGroup.Prepend>
      {
        scale === 'month'
          ? (
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              {...datePickerConfig}
              tileClassName={(input) => getDayClassName({ ...input, segments })}
              onChange={(input) => {
                setDate(null);
                onChange(input);
              }}
            />
          )
          : (
            <DatePicker
              value={date}
              {...datePickerConfig}
              tileContent={(input) => getIntervalSummary({ ...input, segments, maxDate })}
              onChange={(input) => {
                const [start, end] = getRange(input, scale);
                setDate(input);
                onChange({ startDate: start, endDate: end });
              }}
            />
          )
      }
      {startDate && (
        <InputGroup.Append>
          <Button
            variant="danger"
            onClick={() => {
              resetDates();
              setScale(DEFAULT_SCALE);
            }}
          >x
          </Button>
        </InputGroup.Append>
      )}
    </InputGroup>
  );
};

DateFilter.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  segments: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

DateFilter.defaultProps = {
  startDate: null,
  endDate: null,
};

export default DateFilter;
