import React from 'react';
import Sugar from '../utils/sugar';
import { Data } from '../data';
import { tokenize, fts } from '../search';
import { agreeWithNum } from '../utils/agree-with-num';
import updateState from '../utils/update-state';

import {
  Row,
  Col,
  Form,
  InputGroup,
  Dropdown,
  Button,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

import {
  SegmentsList,
  GamesList,
  ResultsPagination
} from './search/results';

import DatePicker from 'react-date-picker';

class InteractiveSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      mode: 'segments',
      data: {
        segments: null,
        categories: null,
        games: null
      },
      query: {
        text: ''
      },
      filters: {
        category: null,
        dateStart: null,
        dateEnd: null
      },
      results: {
        mode: null,
        items: []
      }
    };
  }

  loadData() {
    Promise.all([
      Data.segments, Data.categories, Data.games
    ]).then(([segments, categories, games]) => {
      updateState(this, {
        data: { $merge: { segments, categories, games } },
        loaded: { $set: true }
      });
    });
  }

  handleChange(event) {
    updateState(this, {
      query: { [event.target.name]: { $set: event.target.value } }
    });
  }

  submitForm(event) {
    event.preventDefault();

    let chain;

    if (this.state.mode === 'segments') {
      const segments = this.state.data.segments;
      chain = segments.chain();

      if (this.state.filters.dateStart) {
        if (this.state.filters.dateEnd) {
          chain = chain.find({ date: { $between: [
            this.state.filters.dateStart,
            this.state.filters.dateEnd
          ] } });
        } else {
          chain = chain.find({ date: { $dteq: this.state.filters.dateStart } });
        }
      }

      chain = chain.find({ games: { $size: { $gt: 0 } } });
    } else {
      const games = this.state.data.games;
      chain = games.chain()

      if (this.state.filters.category) {
        chain = chain.find({ 'category.id': this.state.filters.category });
      }

      chain = chain.where((item) => item.category.search !== false);
    }

    let results = chain.data();

    if (tokenize(this.state.query.text).length > 0) {
      results = fts(this.state.query.text, results, (item) => item.name);
    }
  
    updateState(this, {
      results: { $merge: {
        mode: this.state.mode,
        items: results
      } }
    });
  }

  filters() {
    if (this.state.mode === 'segments') {
      const { segments } = this.state.data;

      let minDate = new Date(this.state.data.segments.min('date'));
      let maxDate = new Date(this.state.data.segments.max('date'));
      let { dateStart, dateEnd } = this.state.filters;

      let datePickerOptions = {
        maxDate,
        minDetail: 'decade',
        locale: 'ru-RU',
        tileContent: ({ date, view }) => {
          if (view === 'month') return;
          if (date > maxDate) return;

          let end = new Date(date);
          if (view === 'year') {
            Sugar.Date.advance(end, { months: 1 });
          } else if (view === 'decade') {
            Sugar.Date.advance(end, { years: 1});
          }
          Sugar.Date.rewind(end, { days: 1 });

          let count = segments.count({ date: { $between: [date, end] } });
          return <div>{count} {agreeWithNum(count, 'стрим', ['', 'а', 'ов'])}</div>;
        },
        tileClassName: ({ date, view }) => {
          if (view !== 'month') return;
          let count = segments.count({ date: { $dteq: date } });
          return count > 0 ? 'bg-lightgreen' : 'bg-lightcoral';
        },
        showLeadingZeros: true
      };

      return (
        <Form.Row className="mt-2">
          <InputGroup size="sm" xs={12} md={6} lg={4} as={Col}>
            <InputGroup.Prepend>
              <OverlayTrigger placement="bottom"
                overlay={
                  <Tooltip>
                    Заполните первое поле для поиска по точной дате
                    или оба поля для поиска по диапазону
                  </Tooltip>
                }>
                  <InputGroup.Text>
                    Дата<sup>?</sup>
                  </InputGroup.Text>
              </OverlayTrigger>
            </InputGroup.Prepend>
            <Form.Control
              as={DatePicker}
              value={dateStart}
              onChange={(date) => updateState(this, {
                filters: { dateStart: { $set: date } }
              })}
              minDate={new Date(this.state.data.segments.min('date'))}
              {...datePickerOptions} />
            <Form.Control
              as={DatePicker}
              value={dateEnd}
              onChange={(date) => updateState(this, {
                filters: { dateEnd: { $set: date } }
              })}
              minDate={dateStart || minDate}
              {...datePickerOptions} />
            {dateStart && (
              <InputGroup.Append>
                <Button variant="danger"
                  onClick={() => updateState(this, {
                    filters: { $unset: ['dateStart', 'dateEnd'] }
                  })}>x</Button>
              </InputGroup.Append>
            )}
          </InputGroup>
        </Form.Row>
      );
    } else if (this.state.mode === 'games') {
      return (
        <Form.Row className="mt-2">
          <InputGroup size="sm" as={Col} sm={6} md={4} lg={3}>
            <Form.Control name="category" as="select" custom>
              <option
                onClick={() => updateState(this, {
                  filters: { category: { $set: null } }
                })}>Категория...</option>
              {Object.values(this.state.data.categories)
                .filter((category) => category.search !== false)
                .map((category) => (
                  <option
                    key={category.id}
                    onClick={() => updateState(this, {
                      filters: { category: { $set: category.id } }
                    })}>{category.name}</option>
              ))}
            </Form.Control>
          </InputGroup>
        </Form.Row>
      );
    }

    return null;
  }

  inputForm() {
    return (
      <Form onSubmit={this.submitForm.bind(this)}>
        <InputGroup>
          <InputGroup.Prepend>
            <Dropdown>
              <Dropdown.Toggle variant="success">
                {this.state.mode === 'segments' ? 'Стримы' : 'Игры'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => updateState(this, {
                    mode: { $set: 'segments' }
                  })}>Стримы</Dropdown.Item>
                <Dropdown.Item
                  onClick={() => updateState(this, {
                    mode: { $set: 'games' }
                  })}>Игры</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup.Prepend>
          <Form.Control
            name="text"
            onChange={this.handleChange.bind(this)}
            onKeyPress={(event) => { if (event.code == 'Enter') { this.submitForm(event); } }}
            type="text"
            placeholder="Поиск по названию" />
          <InputGroup.Append>
            <Button variant="primary" onClick={this.submitForm.bind(this)}>Найти</Button>
          </InputGroup.Append>
        </InputGroup>
        {this.filters()}
      </Form>
    );
  }

  resultsRenderer() {
    if (this.state.results.mode === 'segments') {
      return SegmentsList;
    } else if (this.state.results.mode === 'games') {
      return GamesList;
    }

    return null;
  }

  render() {
    if (!this.state.loaded) {
      this.loadData();
      return (
        <div>loading...</div>
      );
    }

    let renderer = this.resultsRenderer();

    return (
      <>
        <Row><Col>{this.inputForm()}</Col></Row>
        {renderer ? <ResultsPagination
          items={this.state.results.items}
          max={10}
          renderer={this.resultsRenderer()}
          rendererProps={{ data: { ...this.state.data } }} /> : null}
      </>
    );
  }
}

export default InteractiveSearch;