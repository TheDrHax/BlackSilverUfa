import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Link } from 'react-router-dom';
import { Col, ListGroup, Row } from 'react-bootstrap';
import Pagination from '@vlsergey/react-bootstrap-pagination';
// Namespace
import { MODES } from './constants';
import { getSegmentDescription, getGameDescription } from '../../utils/data-utils';
import { Image } from '../../components/utils/image';
import { Segment, IndexEntry } from '../../data-types';
import { WatchedProgress } from '../game-page/stream-card';

const GameItem = ({ item }) => (
  <ListGroup.Item key={item}>
    <Row>
      <Col style={{ flex: '0 0 240px' }}>
        <Image className="me-3" width="100%" src={item.segments[0].thumbnail} alt="thumbnail" />
      </Col>

      <Col>
        <div><Link to={item.url}>{item.name}</Link></div>
        <div>
          {item.segments.length === 1
            ? getSegmentDescription(item.segments[0])
            : getGameDescription(item.original)}
        </div>
      </Col>
    </Row>
  </ListGroup.Item>
);

GameItem.propTypes = {
  item: IndexEntry.isRequired,
};

const SegmentItem = ({ item }) => (
  <ListGroup.Item key={item}>
    <Row>
      <Col style={{ flex: '0 0 240px' }}>
        <div style={{ position: 'relative' }}>
          <Image className="me-3" width="100%" src={item.thumbnail} alt="thumbnail" />
          <WatchedProgress segment={item} />
        </div>
      </Col>

      <Col>
        <div><Link to={item.url}>{item.name}</Link></div>
        <div>{getSegmentDescription(item)}</div>
      </Col>
    </Row>
  </ListGroup.Item>
);

SegmentItem.propTypes = {
  item: Segment.isRequired,
};

const SearchResults = ({ mode, items, limit, page, onPageChange }) => {
  const pages = Math.ceil(items.length / limit);
  const pageStart = page * limit;
  const pageEnd = pageStart + limit;

  return (
    <>
      <ListGroup variant="flush" className="py-3">
        {items.slice(pageStart, pageEnd).map((item) => (
          mode === 'segments'
            ? <SegmentItem item={item} />
            : <GameItem item={item} />
        ))}
      </ListGroup>

      {pages > 1 && (
      <Row key="navigator">
        <Col className="d-flex justify-content-center">
          <Pagination
            value={page}
            totalPages={pages}
            atBeginEnd={1}
            aroundCurrent={2}
            showFirstLast={false}
            onChange={({ target }) => onPageChange(target.value)}
          />
        </Col>
      </Row>
      )}
    </>
  );
};

SearchResults.propTypes = {
  items: PropTypes.array,
  limit: PropTypes.number,
  mode: PropTypes.oneOf(MODES).isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

SearchResults.defaultProps = {
  limit: 10,
  items: [],
};

export default SearchResults;
