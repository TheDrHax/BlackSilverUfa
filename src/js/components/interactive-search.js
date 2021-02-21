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
        games: null
      },
      query: {
        text: ''
      },
      results: {
        mode: null,
        items: []
      }
    };
  }

  loadData() {
    Promise.all([
      Data.segments, Data.games
    ]).then(([segments, games]) => {
      this.setState({
        data: {
          segments,
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

      // filters should be here

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
      </Form>
    );
  }

  resultsRenderer() {
    if (this.state.results.mode === 'segments') {
      return SegmentsList;
    } else {
      return GamesList;
    }
  }

  render() {
    if (!this.state.loaded) {
      this.loadData();
      return (
        <div>loading...</div>
      );
    }

    return (
      <>
        <Row><Col>{this.inputForm()}</Col></Row>
        <ResultsPagination
          items={this.state.results.items}
          max={10}
          renderer={this.resultsRenderer()}
          rendererProps={{ data: { ...this.state.data } }} />
      </>
    );
  }
}

export default InteractiveSearch;