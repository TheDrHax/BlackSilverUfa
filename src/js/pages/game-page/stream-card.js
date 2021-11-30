import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const StreamCard = ({ segment, segmentRef }) => (
  <Col className="col-card" xs={6} md={4} lg={3} xl={2}>
    <Card>
      <Link to={segmentRef.url}>
        <Card.Img variant="top" src={segment.thumbnail} />
        <Card.ImgOverlay className="overlay-transparent-bottom bg-dark text-white">
          <Card.Text>{segmentRef.name}</Card.Text>
        </Card.ImgOverlay>
      </Link>
    </Card>
  </Col>
);

StreamCard.propTypes = {
  segment: PropTypes.object.isRequired,
  segmentRef: PropTypes.object.isRequired,
};

export default StreamCard;
