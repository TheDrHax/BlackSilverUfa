import React from 'react';
import PropTypes from 'prop-types';
// Components
import { InputGroup, Button, Dropdown } from 'react-bootstrap';
import DateRangePicker from './date-range-picker';
import DatePicker from './date-picker';
// Namespace
import { searchPage as t } from '../../constants/texts';
import { DEFAULT_SCALE, SCALES } from './constants';
// Utils
import SugarDate from '../../utils/sugar';
import { renderTemplate } from '../../utils/text-utils';

const getRange = (date, scale) => {
  if (!date) {
    return [];
  }

  const startDate = new Date(date);

  if (scale === 'year') {
    SugarDate.reset(startDate, 'month');
  } else if (scale === 'decade') {
    SugarDate.reset(startDate, 'year');
  }

  const endDate = new Date(startDate);
  if (scale === 'year') {
    SugarDate.advance(endDate, { months: 1 });
  } else if (scale === 'decade') {
    SugarDate.advance(endDate, { years: 1 });
  }

  SugarDate.rewind(endDate, { days: 1 });

  return [startDate, endDate];
};

const getIntervalSummary = ({ date, view, segments, maxDate }) => {
  if (date > maxDate) return null;

  const range = getRange(date, view);
  const count = segments.count({ date: { $between: range } });
  return (<div>{renderTemplate('{n} стрим{n#,а,ов}', { n: count })}</div>);
};

const DateFilter = ({ value: { from, to, scale }, segments, onChange, ...rest }) => {
  const minDate = new Date(segments.min('date'));
  const maxDate = new Date(segments.max('date'));

  const datePickerConfig = { scale, minDate, maxDate };

  return (
    <InputGroup {...rest}>
      <Dropdown>
        <Dropdown.Toggle variant="dark">
          {t.scales[scale]}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {SCALES.map((current) => (
            <Dropdown.Item
              key={current}
              active={scale === current}
              onClick={() => onChange({ from: undefined, to: undefined, scale: current })}
            >
              {t.scales[current]}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {
        scale === 'month'
          ? (
            <DateRangePicker
              from={from}
              to={to}
              {...datePickerConfig}
              tileDisabled={({ date }) => segments.count({ date: { $dteq: date } }) === 0}
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
