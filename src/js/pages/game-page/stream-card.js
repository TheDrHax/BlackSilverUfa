import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const StreamCard = ({ title, url, segment, thumbnail }) => (
  <Col className="col-card" xs={6} md={4} lg={3} xl={2}>
    <Card>
      <Link to={`${url}/${segment}`}>
        <Card.Img variant="top" src={thumbnail} />
        <Card.ImgOverlay className="overlay-transparent-bottom bg-dark text-white">
          <Card.Text>{title}</Card.Text>
        </Card.ImgOverlay>
      </Link>
    </Card>
  </Col>
);

StreamCard.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  segment: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
};

export default StreamCard;
