import React from 'react';
import animateScrollTo from 'animated-scroll-to';
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
        category: null,
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

      if (this.state.filters.category) {
        chain = chain.find({ 'category.id': this.state.filters.category });
      }

      chain = chain.where((item) => item.category.search !== false);
    }

    {
      let { mode, desc } = this.state.sorting;

      if (mode === 'date') {
        chain = chain.compoundsort([['date', desc], ['segment', desc]]);
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
        <DateFilter
          key="date"
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
      let { category } = this.state.filters;

      let categoriesMap = Object.assign({},
        ...Object.values(categories.data)
          .filter(({ search }) => search !== false)
          .map(({ id, name }) => ({ [id]: name }))
      );

      filters.push(
        <InputGroup key="category" as={Col}>
          <InputGroup.Prepend>
            <InputGroup.Text>Категория:</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control as={Dropdown} custom>
            <Dropdown.Toggle variant="secondary" className="w-100">
              {category ? categoriesMap[category] : 'Любая'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                key="any"
                active={category === null}
                onClick={() => updateState(this, {
                  filters: { category: { $set: null } }
                }, this.submitForm.bind(this))}>
                Любая
              </Dropdown.Item>
              {Object.entries(categoriesMap).map(([key, name]) => (
                <Dropdown.Item
                  key={key}
                  active={category === key}
                  onClick={() => updateState(this, {
                    filters: { category: { $set: key } }
                  }, this.submitForm.bind(this))}>
                  {name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Form.Control>
        </InputGroup>
      );
    }

    let sortingModes = {
      date: 'дата'
    };

    filters.push(
      <InputGroup key="sorting" xs={12} md={6} lg={4} as={Col}>
        <InputGroup.Prepend>
          <InputGroup.Text>Сортировка:</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control as={Dropdown} custom>
          <Dropdown.Toggle variant="secondary">
            {sortingModes[this.state.sorting.mode]}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.entries(sortingModes).map(([key, name]) => (
              <Dropdown.Item
                key={key}
                active={this.state.sorting.mode === key}
                onClick={() => updateState(this, {
                  sorting: { mode: { $set: key } }
                }, this.submitForm.bind(this))}>
                  {name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Form.Control>
        <Button variant="secondary"
          onClick={() => updateState(this, {
            sorting: { $toggle: ['desc'] }
          }, this.submitForm.bind(this))}>
            {this.state.sorting.desc ? '↓' : '↑'}
        </Button>
      </InputGroup>
    );

    return (
      <Form.Row className="mb-2">
        {filters}
      </Form.Row>
    );
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
                  }, this.submitForm.bind(this))}>Стримы</Dropdown.Item>
                <Dropdown.Item
                  onClick={() => updateState(this, {
                    mode: { $set: 'games' }
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
        <Row><Col>{this.inputForm()}</Col></Row>
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