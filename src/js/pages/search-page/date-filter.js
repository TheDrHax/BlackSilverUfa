import React from 'react';
import PropTypes from 'prop-types';
// Components
import { InputGroup, Button } from 'react-bootstrap';
import Dropdown from './dropdown';
import DateRangePicker from './date-range-picker';
import DatePicker from './date-picker';
// Namespace
import { searchPage as t } from '../../constants/texts';
import { DEFAULT_SCALE, SCALES } from './constants';
// Utils
import Sugar from '../../utils/sugar';
import { renderTemplate } from '../../utils/text-utils';

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
  return (<div>{renderTemplate('{n} стрим{n#,а,ов}', { n: count })}</div>);
};

const getDayClassName = ({ date, segments }) => {
  const count = segments.count({ date: { $dteq: date } });
  return (count ? 'bg-lightgreen' : 'bg-lightcoral');
};

const DateFilter = ({ value: { from, to, scale }, segments, onChange, ...rest }) => {
  const minDate = new Date(segments.min('date'));
  const maxDate = new Date(segments.max('date'));

  const datePickerConfig = { scale, minDate, maxDate };

  return (
    <InputGroup {...rest}>
      <Dropdown
        value={scale}
        variant="dark"
        options={SCALES}
        labels={t.scales}
        onChange={(input) => {
          onChange({ from: undefined, to: undefined, scale: input });
        }}
      />
      {
        scale === 'month'
          ? (
            <DateRangePicker
              from={from}
              to={to}
              {...datePickerConfig}
              tileClassName={(input) => getDayClassName({ ...input, segments })}
              onChange={(input) => {
                onChange(input);
              }}
            />
          )
          : (
            <DatePicker
              value={from}
              {...datePickerConfig}
              tileContent={(input) => getIntervalSummary({ ...input, segments, maxDate })}
              onChange={(input) => {
                const [start, end] = getRange(input, scale);
                onChange({ from: start, to: end });
              }}
            />
          )
      }
      {from && (
        <Button
          variant="danger"
          onClick={() => {
            onChange({ from: undefined, to: undefined, scale: DEFAULT_SCALE });
          }}
        >x
        </Button>
      )}
    </InputGroup>
  );
};

DateFilter.propTypes = {
  value: PropTypes.shape({
    scale: PropTypes.oneOf(SCALES),
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
  }).isRequired,
  segments: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateFilter;
