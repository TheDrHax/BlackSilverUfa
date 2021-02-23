import React from 'react';
import { Data } from '../data';
import { tokenize, fts } from '../search';
import { agreeWithNum } from '../utils/agree-with-num';
import updateState from '../utils/update-state';
import DateFilter from './search/date-filter';

import {
  Row,
  Col,
  Form,
  InputGroup,
  Dropdown,
  Button,
  Alert
} from 'react-bootstrap';

import {
  SegmentsList,
  GamesList,
  ResultsPagination
} from './search/results';

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

  componentDidMount() {
    this.loadData();
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

      let { dateStart, dateEnd } = this.state.filters;

      if (dateStart) {
        if (dateEnd) {
          chain = chain.find({ date: { $between: [
            dateStart, dateEnd
          ] } });
        } else {
          chain = chain.find({ date: { $dteq: dateStart } });
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

      return (
        <Form.Row className="mb-2">
          <DateFilter
            minDate={minDate}
            maxDate={maxDate}
            tileContent={({ date, view }) => {
              if (view === 'month' || date > maxDate) return;
              let range = DateFilter.dateToRange(date, view);
              let count = segments.count({ date: { $between: range } });
              return <div>{count} {agreeWithNum(count, 'стрим', ['', 'а', 'ов'])}</div>;
            }}
            tileClassName={({ date, view }) => {
              if (view !== 'month') return;
              let count = segments.count({ date: { $dteq: date } });
              return count > 0 ? 'bg-lightgreen' : 'bg-lightcoral';
            }}
            onChange={(start, end) => updateState(this, {
              filters: {
                dateStart: { $set: start },
                dateEnd: { $set: end }
              }
            })} />
        </Form.Row>
      );
    } else if (this.state.mode === 'games') {
      return (
        <Form.Row className="mb-2">
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
        <InputGroup className="mb-2">
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
      return (
        <div>loading...</div>
      );
    }

    let renderer = this.resultsRenderer();

    return (
      <>
        <Row>
          <Col>
            <Alert variant="warning">
              Поиск ещё находится на стадии разработки. Я планирую добавить больше
              фильтров, сортировку результатов и доработать оформление :)
            </Alert>
          </Col>
        </Row>
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