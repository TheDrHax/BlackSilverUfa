import React from 'react';
import animateScrollTo from 'animated-scroll-to';
import { invert } from 'lodash/object';
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
      filters: {
        text: '',
        category: 'any',
        dateStart: null,
        dateEnd: null
      },
      sorting: {
        mode: 'date',
        desc: true
      },
      results: {
        mode: null,
        items: [],
        page: 0
      }
    };
  }

  loadData() {
    return Data.then(({segments, categories, games}) => {
      updateState(this, {
        data: { $merge: { segments, categories, games } },
        loaded: { $set: true }
      });
    });
  }

  async componentDidMount() {
    await this.loadData();
    this.submitForm();
  }

  submitForm(event) {
    if (event) {
      event.preventDefault();
    }

    let chain;

    if (this.state.mode === 'segments') {
      chain = this.state.data.segments.chain();

      {
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
      }

      chain = chain.find({ games: { $size: { $gt: 0 } } });
    } else if (this.state.mode === 'games') {
      chain = this.state.data.games.chain()

      let { category } = this.state.filters;
      if (category != 'any') {
        chain = chain.find({ 'category.id': category });
      }

      chain = chain.where((item) => item.category.search !== false);
    }

    {
      let { mode, desc } = this.state.sorting;

      if (mode === 'date') {
        chain = chain.compoundsort([['date', desc], ['segment', desc]]);
      } else if (mode === 'stream_count' && this.state.mode === 'games') {
        chain = chain.compoundsort([['streams', desc], ['date', desc], ['segment', desc]]);
      }
    }

    let results = chain.data();

    {
      let { text } = this.state.filters;

      if (tokenize(text).length > 0) {
        results = fts(text, results, ({ name }) => name);
      }
    }
  
    updateState(this, {
      results: { $merge: {
        mode: this.state.mode,
        items: results,
        page: 0
      } }
    });
  }

  filters() {
    const { segments, categories } = this.state.data;

    let filters = [];

    if (this.state.mode === 'segments') {
      let minDate = new Date(segments.min('date'));
      let maxDate = new Date(segments.max('date'));

      filters.push(
        <DateFilter key="date" xs={12} sm={8} md={6} lg={4}
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
          }, this.submitForm.bind(this))} />
      );
    } else if (this.state.mode === 'games') {
      {
        let { category } = this.state.filters;

        let catMap = Object.assign({ any: 'Любая' },
          ...Object.values(categories.data)
            .filter(({ search }) => search !== false)
            .map(({ id, name }) => ({ [id]: name }))
        );

        let invCatMap = invert(catMap);

        filters.push(
          <InputGroup key="category" xs={12} sm={8} md={6} lg={4} as={Col}>
            <InputGroup.Prepend>
              <InputGroup.Text>Категория:</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" custom
              value={catMap[category]}
              onChange={({ target: { value } }) => updateState(this, {
                filters: { category: { $set: invCatMap[value] } }
              }, this.submitForm.bind(this))}>
                {Object.entries(catMap).map(([key, name]) => (
                  <option key={key}>{name}</option>
                ))}
            </Form.Control>
          </InputGroup>
        );
      }
    }

    {
      let { mode, desc } = this.state.sorting;

      let sortModes = {
        date: 'дата'
      };

      if (this.state.mode === 'games') {
        sortModes.stream_count = 'стримы';
      }

      let invSortModes = invert(sortModes);

      filters.push(
        <InputGroup key="sorting" xs={12} sm={8} md={6} lg={4} as={Col}>
          <InputGroup.Prepend>
            <InputGroup.Text>Сортировка:</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control as="select" custom
            value={sortModes[mode]}
            onChange={({ target: { value } }) => updateState(this, {
              sorting: { mode: { $set: invSortModes[value] } }
            }, this.submitForm.bind(this))}>
              {Object.entries(sortModes).map(([key, name]) => (
                <option key={key}>{name}</option>
              ))}
          </Form.Control>
          <InputGroup.Append>
            <Button variant="secondary"
              onClick={() => updateState(this, {
                sorting: { $toggle: ['desc'] }
              }, this.submitForm.bind(this))}>
                {desc ? '↓' : '↑'}
            </Button>
          </InputGroup.Append>
        </InputGroup>
      );
    }

    return <Form.Row>{filters}</Form.Row>;
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
                    mode: { $set: 'segments' },
                    sorting: {
                      mode: { $set: 'date' }
                    }
                  }, this.submitForm.bind(this))}>Стримы</Dropdown.Item>
                <Dropdown.Item
                  onClick={() => updateState(this, {
                    mode: { $set: 'games' },
                    sorting: {
                      mode: { $set: 'date' }
                    }
                  }, this.submitForm.bind(this))}>Игры</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup.Prepend>
          <Form.Control
            onChange={(event) => updateState(this, {
              filters: { text: { $set: event.target.value } }
            })}
            onKeyPress={(event) => { event.code == 'Enter' && this.submitForm(event) }}
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
        <Row className="interactive-search-form">
          <Col>{this.inputForm()}</Col>
        </Row>
        {renderer ? <ResultsPagination
          items={this.state.results.items}
          page={this.state.results.page}
          onPageChange={(page) => {
            updateState(this, {
              results: {
                page: { $set: page }
              }
            });
            animateScrollTo(0);
          }}
          max={10}
          renderer={this.resultsRenderer()}
          rendererProps={{ data: { ...this.state.data } }} /> : null}
      </>
    );
  }
}

export default InteractiveSearch;