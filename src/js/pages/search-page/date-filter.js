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

  switch (scale) {
    case 'month': SugarDate.reset(startDate, 'day'); break;
    case 'year': SugarDate.reset(startDate, 'month'); break;
    case 'decade': SugarDate.reset(startDate, 'year'); break;
    default: throw Error(`Unexpected scale: ${scale}`);
  }

  const endDate = new Date(startDate);

  switch (scale) {
    case 'month': SugarDate.advance(endDate, { days: 1 }); break;
    case 'year': SugarDate.advance(endDate, { months: 1 }); break;
    case 'decade': SugarDate.advance(endDate, { years: 1 }); break;
    default: throw Error(`Unexpected scale: ${scale}`);
  }

  SugarDate.rewind(endDate, { seconds: 1 });

  return [startDate, endDate];
};

const getRangeCount = ({ segments, date, view }) => segments.count({
  date: { $between: getRange(date, view) },
});

const getIntervalSummary = ({ date, view, segments, maxDate }) => {
  if (date > maxDate) return null;
  if (view === 'month') return null;
  const count = getRangeCount({ segments, date, view });
  return (<div>{renderTemplate('{n} стрим{n#,а,ов}', { n: count })}</div>);
};

const DateFilter = ({ value: { from, to, scale }, segments, onChange, ...rest }) => {
  const minDate = new Date(segments.min('date'));
  const maxDate = new Date(segments.max('date'));

  const tileContent = (input) => getIntervalSummary({ ...input, segments, maxDate });
  const tileDisabled = ({ date, view }) => getRangeCount({ segments, date, view }) === 0;
  const datePickerConfig = { scale, minDate, maxDate, tileContent, tileDisabled };

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
              onChange={(input) => {
                onChange(input);
              }}
            />
          )
          : (
            <DatePicker
              value={from}
              {...datePickerConfig}
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
