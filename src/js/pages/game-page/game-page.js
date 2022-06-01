import React from 'react';
// Components
import { Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../../components';
import StreamCard from './stream-card';
import ErrorPage from '../error-page';
// Utils
import { getGameDescription } from '../../utils/data-utils';
// Hooks
import { useDataStore } from '../../hooks/use-data-store';

const GamePage = ({ match }) => {
  const [{ games }, isReady] = useDataStore();
  const { game: gameId } = match.params;

  if (!isReady) {
    return <Layout isLoading />;
  }

  const game = games.by('id', gameId);

  if (!game) {
    return <ErrorPage />;
  }

  const thumbnail = new URL(game.streams[0].original.thumbnail, window.location.href);

  return (
    <Layout title={game.name}>
      <Helmet>
        <meta
          property="og:description"
          content={getGameDescription(game)}
        />
        <meta property="og:image" content={thumbnail} />
      </Helmet>
      <Row>
        <Col>
          <h1 className="text-white pt-2">{game.name}</h1>
        </Col>
      </Row>
      <Row className="d-flex">
        {game.streams.map((ref) => <StreamCard key={ref.segment} segmentRef={ref} />)}
      </Row>
    </Layout>
  );
};

export default GamePage;
