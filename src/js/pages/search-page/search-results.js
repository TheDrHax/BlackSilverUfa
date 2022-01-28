import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Link } from 'react-router-dom';
import { Col, ListGroup, Row } from 'react-bootstrap';
import Pagination from '@vlsergey/react-bootstrap-pagination';
// Namespace
import { MODES } from './constants';
import { getSegmentDescription, getGameDescription } from '../../utils/data-utils';

const PAGE_LIMIT = 10;

const THUMBNAIL_GENERATORS = {
  segments: (item) => item.thumbnail,
  games: (item) => item.segments[0].thumbnail,
};

const DESCRIPTION_GENERATORS = {
  segments: getSegmentDescription,
  games: (game) => (game.original.type !== 'list'
    ? getGameDescription(game.original)
    : getSegmentDescription(game.segments[0])
  ),
};

const SearchResults = ({ mode, items, page, onPageChange }) => {
  const getThumbnail = THUMBNAIL_GENERATORS[mode];
  const getDescription = DESCRIPTION_GENERATORS[mode];

  const pages = Math.ceil(items.length / PAGE_LIMIT);
  const pageStart = page * PAGE_LIMIT;
  const pageEnd = pageStart + PAGE_LIMIT;

  return (
    <>
      <ListGroup variant="flush" className="py-3">
        {items.slice(pageStart, pageEnd).map((item) => (
          <ListGroup.Item key={item.name}>
            <Row>
              <Col xs={4} lg={3} xl={2}>
                <img className="me-3" width="100%" src={getThumbnail(item)} alt="thumbnail" />
              </Col>

              <Col>
                <div><Link to={item.url} className="stretched-link">{item.name}</Link></div>
                <div>{getDescription(item)}</div>
              </Col>
            </Row>
          </ListGroup.Item>
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
  mode: PropTypes.oneOf(MODES).isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

SearchResults.defaultProps = {
  items: [],
};

export default SearchResults;
export { getGameDescription };
