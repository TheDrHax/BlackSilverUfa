import React from 'react';
import DatePicker from 'react-date-picker';
import updateState from '../../utils/update-state';
import Sugar from '../../utils/sugar';

import {
  InputGroup,
  Col,
  Dropdown,
  Form,
  Button
} from 'react-bootstrap';

export default class DateFilter extends React.Component {
  scales = {
    month: 'День',
    year: 'Месяц',
    decade: 'Год'
  }

  static dateToRange(date, scale) {
    if (!date) {
      return [null, null];
    }

    let start = new Date(date);

    if (scale === 'year') {
      Sugar.Date.reset(start, 'month');
    } else if (scale === 'decade') {
      Sugar.Date.reset(start, 'year');
    }

    let end = new Date(start);

    if (scale === 'year') {
      Sugar.Date.advance(end, { months: 1 });
    } else if (scale === 'decade') {
      Sugar.Date.advance(end, { years: 1 });
    }

    Sugar.Date.rewind(end, { days: 1 });

    return [start, end];
  }

  constructor(props) {
    super(props);

    this.state = {
      start: null,
      end: null,
      scale: 'year'
    }
  }

  onChange(spec) {
    updateState(this, spec, () => {
      if (this.props.onChange) {
        let { start, end, scale } = this.state;

        if (scale === 'year' || scale === 'decade') {
          [start, end] = DateFilter.dateToRange(start, scale);
        }

        this.props.onChange(start, end);
      }
    });
  }

  render() {
    let { minDate, maxDate, tileContent, tileClassName } = this.props;
    let { start, end, scale } = this.state;

    let datePickerOptions = {
      maxDate,
      minDetail: 'decade',
      maxDetail: scale,
      locale: 'ru-RU',
      tileContent,
      tileClassName,
      showLeadingZeros: true
    };

    let { xs, sm, md, lg, xl } = this.props;

    return (
      <InputGroup as={Col} {...{ xs, sm, md, lg, xl }}>
        <InputGroup.Prepend>
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              {this.scales[scale]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.entries(this.scales).map(([scale, name]) => (
                <Dropdown.Item key={scale}
                  onClick={() => this.onChange({
                    start: { $set: null },
                    end: { $set: null },
                    scale: { $set: scale }
                  })}>{name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup.Prepend>
        <Form.Control
          as={DatePicker}
          value={start}
          onChange={(date) => this.onChange({ start: { $set: date } })}
          minDate={minDate}
          {...datePickerOptions} />
        {scale === 'month' && (
          <Form.Control
            as={DatePicker}
            value={end}
            onChange={(date) => this.onChange({ end: { $set: date } })}
            minDate={start || minDate}
            {...datePickerOptions} />
        )}
        {start && (
          <InputGroup.Append>
            <Button variant="danger"
              onClick={() => this.onChange({
                start: { $set: null },
                end: { $set: null },
                scale: { $set: 'year' }
              })}>x</Button>
          </InputGroup.Append>
        )}
      </InputGroup>
    );
  }
}