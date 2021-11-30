import React, { useEffect, useState } from 'react';
import { zip } from 'lodash';
// Components
import { Col, Row } from 'react-bootstrap';
import { Layout } from '../../components';
import StreamCard from './stream-card';
// Hooks
import { useTitle } from '../../hooks/use-title';
// Utils
import { Data } from '../../data';
import Matomo from '../../matomo';

const getSegmentsByRefs = (segmentRefs, segments) => (
  segmentRefs.map((segmentRef) => (
    segments.by('segment', segmentRef.segment)
  ))
);

const GamePage = ({ match }) => {
  const [game, setGame] = useState({ name: '', segments: [], segmentRefs: [] });
  const [isLoading, setLoading] = useState(true);

  const { game: gameId } = match.params;

  useTitle(game.name);

  useEffect(() => {
    Matomo.trackPageView();
    Data.then((data) => {
      const { name, streams: segmentRefs } = data.games.by('id', gameId);
      const segments = getSegmentsByRefs(segmentRefs, data.segments);

      setGame({ name, segments, segmentRefs });
      setLoading(false);
    });
  }, [gameId]);

  return (
    <Layout isLoading={isLoading}>
      <Row>
        <Col>
          <h1 className="text-white pt-2">{game.name}</h1>
        </Col>
      </Row>
      <Row className="d-flex">
        {zip(game.segments, game.segmentRefs).map(([segment, segmentRef]) => (
          <StreamCard key={segment.segment} segment={segment} segmentRef={segmentRef} />
        ))}
      </Row>
    </Layout>
  );
};

export default GamePage;
