import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// Components
import { Link } from 'react-router-dom';
import { Col, ListGroup, Media, Row } from 'react-bootstrap';
import Pagination from '@vlsergey/react-bootstrap-pagination';
// Utils
import animateScrollTo from 'animated-scroll-to';
import Sugar from '../../utils/sugar';
import { getStreamsLabel } from './utils';
// Namespace
import { MODES } from './constants';
import { searchPage as t } from '../../constants/texts';

const getLastDate = (segments) => Sugar.Date.short(segments[segments.length - 1].date);
const getGameDescription = ({ segments, streams }) => {
  const totalCount = getStreamsLabel(streams);
  const startDate = Sugar.Date.short(segments[0].date);

  return streams > 1
    ? `${totalCount} ${t.from} ${startDate} ${t.to} ${getLastDate(segments)}`
    : `${totalCount} ${startDate}`;
};

const PAGE_LIMIT = 10;

const THUMBNAIL_GENERATORS = {
  segments: (item) => item.thumbnail,
  games: (item, segments) => segments.by('segment', item.segment)?.thumbnail,
};

const DESCRIPTION_GENERATORS = {
  segments: ({ date }) => Sugar.Date.short(date),
  games: getGameDescription,
};

const SearchResults = ({ mode, items, page, segments, onPageChange }) => {
  const getThumbnail = THUMBNAIL_GENERATORS[mode];
  const getDescription = DESCRIPTION_GENERATORS[mode];

  const pages = Math.ceil(items.length / PAGE_LIMIT);
  const pageStart = page * PAGE_LIMIT;
  const pageEnd = pageStart + PAGE_LIMIT;

  useEffect(() => {
    animateScrollTo(0);
  }, [page]);

  return (
    <>
      <ListGroup variant="flush">
        {items.slice(pageStart, pageEnd).map((item) => (
          <ListGroup.Item key={item.name}>
            <Media>
              <img width={128} className="mr-3" src={getThumbnail(item, segments)} alt="thumbnail" />

              <Media.Body>
                <Row>
                  <Col>
                    <Link to={item.url}>{item.name}</Link>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {getDescription(item)}
                  </Col>
                </Row>
              </Media.Body>
            </Media>
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
  segments: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(MODES).isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

SearchResults.defaultProps = {
  items: [],
};

export default SearchResults;
