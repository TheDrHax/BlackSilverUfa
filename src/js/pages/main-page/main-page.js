import React from 'react';
import reverse from 'lodash/reverse';
import truncate from 'lodash/truncate';
import { Button, Card, Col, Ratio, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Layout } from '../../components';
import { StatsBlock } from './stats';
import { useDataStore } from '../../hooks/use-data-store';
import { useResponsiveValue } from '../../hooks/use-breakpoints';
import PATHS from '../../constants/urls';
import StreamCard from '../game-page/stream-card';

const selectRecentSegments = ({ segments }, count = 10) => reverse(
  segments.chain()
    .find({ games: { $size: { $gt: 0 } } })
    .compoundsort(['date', 'segment'])
    .offset(-count)
    .data(),
);

export default function MainPage() {
  const [data, isReady] = useDataStore();
  const maxNameLength = useResponsiveValue([80, 120]);
  const cards = useResponsiveValue([8, 8, 12, 16, 20]);

  return (
    <Layout title="Главная страница" className="text-white pt-3" canonicalPath="/">
      <Row>
        <p>
          Добро пожаловать на сайт архива стримов Twitch-канала{' '}
          <a href="https://www.twitch.tv/blackufa/">BlackUFA</a>!

          Здесь собраны почти все стримы, начиная с марта 2017. Для этих стримов также
          сохранена запись чата в виде субтитров.
          Более ранние стримы (2015-2017) в данный момент постепенно{' '}
          <a href="https://github.com/TheDrHax/BlackSilverUfa/issues/29">восстанавливаются</a>.
        </p>

        <p>
          Сайт использует собственный сервер для свежих записей и различные YouTube-каналы
          для постоянного хранения. Свежие записи хранятся в течение 2 месяцев, и всё это время они
          раздаются через торренты. Доступность всех записей на YouTube ежедневно проверяется, а
          заблокированные видео обычно перезаливаются в тот же день.
        </p>
      </Row>

      <StatsBlock />

      {isReady && (
        <>
          <div className="mt-3 d-flex align-items-center">
            <h1>Недавние стримы</h1>
            <Button variant="dark" as={Link} to={PATHS.SEARCH} size="sm" className="ms-3">
              Показать все
            </Button>
          </div>

          <Row className="g-0 d-flex pb-4">
            {selectRecentSegments(data, cards - 1).map((segment) => ({
              name: truncate(segment.name, { length: maxNameLength }),
              start: 0,
              segment: segment.segment,
              original: segment,
              url: segment.url,
              subrefs: [],
            })).map((segmentRef) => (
              <StreamCard key={segmentRef.segment} segmentRef={segmentRef} />
            ))}

            <Col className="p-1 col-card" xs={6} md={4} lg={3} xl={2}>
              <Card>
                <Ratio aspectRatio="16x9">
                  <Link to={PATHS.SEARCH} className="show-more">
                    <h2>Показать ещё</h2>
                  </Link>
                </Ratio>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Layout>
  );
}
