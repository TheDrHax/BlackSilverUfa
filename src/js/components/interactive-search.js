import React from 'react';
import { Data } from '../data';
import { tokenize, fts } from '../search';

import {
  Row,
  Col,
  Form,
  InputGroup,
  Dropdown,
  Button
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
        category: null
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
      this.setState({
        data: {
          segments,
          categories,
          games
        },
        loaded: true
      })
    });
  }

  handleChange(event) {
    this.setState({
      query: {
        ...this.state.query,
        [event.target.name]: event.target.value
      }
    });
  }

  submitForm(event) {
    event.preventDefault();

    let chain;

    if (this.state.mode === 'segments') {
      const segments = this.state.data.segments;
      chain = segments.chain();

      // filters should be here

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

    this.setState({
      results: {
        mode: this.state.mode,
        items: results
      }
    });
  }

  filters() {
    if (this.state.mode === 'segments') {
      return null;
    } else if (this.state.mode === 'games') {
      return (
        <Form.Row className="mt-2">
          <InputGroup size="sm" as={Col} sm={6} md={4} lg={3}>
            <Form.Control name="category" as="select" custom>
              <option onClick={() => this.setState({ filters: { category: null } })}>Категория...</option>
              {Object.values(this.state.data.categories)
                .filter((category) => category.search !== false)
                .map((category) => (
                <option key={category.id} onClick={() => this.setState({ filters: { category: category.id } })}>
                  {category.name}
                </option>
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
                <Dropdown.Item onClick={() => this.setState({ mode: 'segments' })}>Стримы</Dropdown.Item>
                <Dropdown.Item onClick={() => this.setState({ mode: 'games' })}>Игры</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup.Prepend>
          <Form.Control
            name="text"
            onChange={this.handleChange.bind(this)}
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