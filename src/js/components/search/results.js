import React from 'react';

import {
  Row,
  Col,
  Media,
  ListGroup
} from 'react-bootstrap';

import Pagination from '@vlsergey/react-bootstrap-pagination';

import { agreeWithNum } from '../../utils/agree-with-num';
import Sugar from '../../utils/sugar';

class GenericList extends React.Component {
  key(item) {
    throw "Not Implemented";
  }

  thumbnail(item) {
    throw "Not Implemented";
  }

  url(item) {
    throw "Not Implemented";
  }

  description(item) {
    throw "Not Implemented";
  }

  items() {
    return this.props.items.map((item) => {
      return (
        <ListGroup.Item key={this.key(item)}>
          <Media>
            <img width={128} className="mr-3" src={this.thumbnail(item)} />

            <Media.Body>
              <Row>
                <Col>
                  <a href={this.url(item)}>{item.name}</a>
                </Col>
              </Row>
              <Row>
                <Col>
                  {this.description(item)}
                </Col>
              </Row>
            </Media.Body>
          </Media>
        </ListGroup.Item>
      );
    });
  }

  render() {
    return (
      <ListGroup variant="flush">
        {this.items()}
      </ListGroup>
    )
  }
}

class SegmentsList extends GenericList {
  key(segment) {
    return segment.segment;
  }

  thumbnail(segment) {
    if (segment.youtube) {
      return `https://img.youtube.com/vi/${segment.youtube}/mqdefault.jpg`;
    } else {
      return '/static/images/no-preview.png';
    }
  }

  url(segment) {
    return `/links/${segment.games[0]}.html#${segment.segment}`;
  }

  description(segment) {
    return Sugar.Date.short(segment.date);
  }
}

class GamesList extends GenericList {
  key(game) {
    return game.name;
  }

  url(game) {
    if (game.type === 'segment') {
      return `/links/${game.id}.html#${game.segment}`;
    } else {
      return `/links/${game.id}.html`;
    }
  }

  thumbnail(game) {
    let segment = this.props.data.segments.by('segment', game.segment);

    if (segment.youtube) {
      return `https://img.youtube.com/vi/${segment.youtube}/mqdefault.jpg`;
    } else {
      return '/static/images/no-preview.png';
    }
  }

  description(game) {
    let res = '';
    let segments;

    if (game.type === 'segment') {
      segments = [this.props.data.segments.by('segment', game.segment)];
    } else {
      segments = this.props.data.segments.chain()
        .find({ games: { $contains: game.id } })
        .simplesort('date')
        .data();
    }

    if (segments.length > 1) {
      res += `${segments.length} ${agreeWithNum(segments.length, 'стрим', ['', 'а', 'ов'])}`;

      res += ` с ${Sugar.Date.short(segments[0].date)}`
      res += ` по ${Sugar.Date.short(segments[segments.length - 1].date)}`
    } else {
      res += Sugar.Date.short(segments[0].date);
    }

    return res;
  }
}

class ResultsPagination extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0
    };
  }

  items() {
    if (this.props.items.length <= this.props.max) {
      return this.props.items;
    }

    return this.props.items.slice(
      this.state.page * this.props.max,
      (this.state.page + 1) * this.props.max
    );
  }

  content() {
    return React.createElement(this.props.renderer, {
      ...this.props.rendererProps,
      items: this.items(),
      key: 'content'
    });
  }

  navigator() {
    let pages = Math.ceil(this.props.items.length / this.props.max);

    if (pages <= 1) {
      return null;
    }

    return (
      <Row>
        <Col>
          <Pagination
            totalPages={pages}
            value={this.state.page}
            showFirstLast={false}
            atBeginEnd={1}
            aroundCurrent={2}
            onChange={({ target: { value }}) => this.setState({ page: value })} />
        </Col>
      </Row>
    )
  }

  render() {
    return [
      this.content(),
      this.navigator()
    ];
  }
}

export { SegmentsList, GamesList, ResultsPagination };