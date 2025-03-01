import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, Collapse, InputGroup, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Resizable } from 're-resizable';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import SugarDate from '../../utils/sugar';
import { Game, Segment } from '../../data-types';
import { Scroll } from '../scroll';
import { FAIcon } from '../../utils/fontawesome';

const BUTTON_STYLE = { variant: 'dark', size: 'sm' };

const SegmentRefList = ({ game, currentSegment, contentKey }) => (
  <Scroll className="h-100" scrollTo=".active" scrollDelay={100} contentKey={contentKey}>
    <ListGroup className="playlist-streams separator-v">
      {game.streams.map((segmentRef) => (
        <ListGroup.Item
          key={segmentRef.segment}
          as={Link}
          to={segmentRef.url}
          action
          active={segmentRef.original === currentSegment}
          className="playlist-streams-item"
        >
          <span className="flex-grow-1">{segmentRef.name}</span>
          <span>
            <Badge pill bg="dark">
              {SugarDate.format(segmentRef.original.date, '{dd}.{MM}')}
              <br />
              {segmentRef.original.date.getFullYear()}
            </Badge>
          </span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </Scroll>
);

SegmentRefList.propTypes = {
  game: Game.isRequired,
  currentSegment: Segment.isRequired,
  contentKey: PropTypes.any,
};

SegmentRefList.defaultProps = {
  contentKey: null,
};

const CollapseWrapper = ({ open, children }) => (
  <Collapse in={open}>
    <div>
      <Resizable defaultSize={{ height: '30vh' }} enable={{ bottom: true }}>
        {children}
      </Resizable>
    </div>
  </Collapse>
);

CollapseWrapper.propTypes = {
  open: PropTypes.bool.isRequired,
};

export const Playlist = ({ games, game, segment, autoExpand, fullHeight }) => {
  const [currentGame, setGame] = useState(game);
  const [open, setOpen] = useState(autoExpand);

  const activeIndex = games.indexOf(currentGame);
  const prevItem = activeIndex !== 0 && games[activeIndex - 1];
  const nextItem = activeIndex !== games.length - 1 && games[activeIndex + 1];

  useEffect(() => {
    setGame(game);
  }, [game]);

  return (
    <>
      <InputGroup className="d-flex flex-row playlist-header separator-h">
        <Button
          onClick={() => setGame(prevItem)}
          disabled={!prevItem}
          {...BUTTON_STYLE}
        >
          <FAIcon icon={faArrowLeft} />
        </Button>
        <Button
          onClick={() => setOpen(!open)}
          className="flex-1-0-0"
          disabled={fullHeight}
          {...BUTTON_STYLE}
        >
          {currentGame.name}
        </Button>
        <Button
          onClick={() => setGame(nextItem)}
          disabled={!nextItem}
          {...BUTTON_STYLE}
        >
          <FAIcon icon={faArrowRight} />
        </Button>
      </InputGroup>

      {fullHeight ? (
        <SegmentRefList
          game={currentGame}
          currentSegment={segment}
          contentKey={currentGame.id}
        />
      ) : (
        <CollapseWrapper open={open}>
          <SegmentRefList
            game={currentGame}
            currentSegment={segment}
            contentKey={currentGame.id + open}
          />
        </CollapseWrapper>
      )}
    </>
  );
};

Playlist.propTypes = {
  games: PropTypes.arrayOf(Game).isRequired,
  game: Game.isRequired,
  segment: Segment.isRequired,
  autoExpand: PropTypes.bool,
  fullHeight: PropTypes.bool,
};

Playlist.defaultProps = {
  autoExpand: false,
  fullHeight: false,
};
