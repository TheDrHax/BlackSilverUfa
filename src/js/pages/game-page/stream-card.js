import React, { useMemo } from 'react';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Image } from '../../components/utils/image';
import { Segment, SegmentRef } from '../../data-types';
import { useDataStore } from '../../hooks/use-data-store';
import SavedPosition from '../../utils/saved-position';

const WatchedProgress = ({ segment }) => {
  const [{ persist }, loaded] = useDataStore();

  const progress = useMemo(() => {
    if (!loaded) return 0;

    const spa = new SavedPosition(persist, segment);
    if (!spa.exists() || segment.abs_end === 0) return 0;

    let x = spa.get() - segment.abs_start;
    x *= 100;
    x /= segment.abs_end - segment.abs_start;
    x = Math.min(100, Math.ceil(x));

    return x;
  }, [loaded, segment.segment]);

  if (progress === 0) return <></>;

  return (
    <div className="watch-progress">
      <div style={{ width: `${progress}%` }} />
    </div>
  );
};

WatchedProgress.propTypes = {
  segment: Segment.isRequired,
};

const StreamCard = ({ segmentRef }) => (
  <Col className="p-1 col-card" xs={6} md={4} lg={3} xl={2}>
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
      <WatchedProgress segment={segmentRef.original} />
    </Card>
  </Col>
);

StreamCard.propTypes = {
  segmentRef: SegmentRef.isRequired,
};

export default StreamCard;
