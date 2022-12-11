import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Image } from '../../components/utils/image';

const StreamCard = ({ segmentRef }) => (
  <Col className="col-card" xs={6} md={4} lg={3} xl={2}>
    <Card className="card-game">
      <Link to={segmentRef.url}>
        <Card.Img
          as={Image}
          variant="top"
          src={segmentRef.original.thumbnail}
        />
        <Card.ImgOverlay className="overlay-transparent-bottom bg-dark text-white">
          <Card.Text>{segmentRef.name}</Card.Text>
        </Card.ImgOverlay>
      </Link>
    </Card>
  </Col>
);

StreamCard.propTypes = {
  segmentRef: PropTypes.object.isRequired,
};

export default StreamCard;
