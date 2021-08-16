import React, { useEffect, useState } from 'react';
// Components
import { Col, Row } from 'react-bootstrap';
import { Layout } from '../../components';
import StreamCard from './stream-card';
// Hooks
import { useTitle } from '../../hooks/use-title';
// Utils
import { Data } from '../../data';
import Matomo from '../../matomo';

const parseUrl = ({ url, params }) => ({ url, gameId: params.game });
const getGameSegments = (streams, segments) => streams.map((stream) => {
  const title = stream.name;
  const { segment, thumbnail } = segments.by('segment', stream.segment);

  return ({ title, segment, thumbnail });
});

const GamePage = ({ match }) => {
  const [game, setGame] = useState({ name: '', segments: [] });
  const [isLoading, setLoading] = useState(true);

  const { url, gameId } = parseUrl(match);

  useTitle(game.name);

  useEffect(() => {
    Matomo.trackPageView();
    Data.then((data) => {
      const { name, streams } = data.games.by('id', gameId);
      const segments = getGameSegments(streams, data.segments);

      setGame({ name, segments });
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
        {game.segments.map((stream) => (<StreamCard key={stream.segment} url={url} {...stream} />))}
      </Row>
    </Layout>
  );
};

export default GamePage;
