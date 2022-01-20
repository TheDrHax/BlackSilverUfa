import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, InputGroup, Pagination, Popover, Spinner } from 'react-bootstrap';
import { getBaseSegment } from '../../utils/data-utils';
import { Data } from '../../data';
import { ftime } from '../../utils/time-utils';

const getShortLink = (game, segment, at) => (
  // eslint-disable-next-line prefer-template
  'https://drhx.ru/'
  + (game ? `${game}/` : '')
  + segment.segment
  + (at ? `?at=${at}` : '')
);

const getMpvCommand = (segment, t) => (
  // eslint-disable-next-line prefer-template
  [
    'mpv',
    (segment.subtitles ? `--sub-file=${new URL(segment.subtitles, window.location.href)}` : ''),
    (segment.abs_start !== 0 ? `--sub-delay=${-segment.abs_start}` : ''),
    (t ? `--start=${t}` : ''),
    (segment.end ? `--end=${segment.end}` : ''),
    (segment.youtube ? `ytdl://${segment.youtube}` : segment.direct),
  ].filter((x) => x).join(' ')
);

const Mode = {
  link: 'Ссылка',
  mpv: 'Команда MPV',
};

const ModeSelector = ({ mode, onChange }) => (
  <Pagination size="sm" className="d-flex mb-0">
    {Object.entries(Mode).map(([key, value]) => (
      <Pagination.Item
        key={key}
        active={mode === key}
        onClick={() => onChange(key)}
        className="flex-1-0-0"
      >
        {value}
      </Pagination.Item>
    ))}
  </Pagination>
);

ModeSelector.propTypes = {
  mode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ShareOverlay = React.forwardRef((props, ref) => {
  const {
    game,
    segment,
    currentTime,
    ...otherProps
  } = props;

  const inputRef = useRef();
  const time = Math.floor(currentTime);
  const [mode, setMode] = useState('link');
  const [segments, setSegments] = useState(null);
  const [includeTime, setIncludeTime] = useState(time > 0);
  const [includeGame, setIncludeGame] = useState(false);

  useEffect(() => {
    Data.then(({ segments: s }) => setSegments(s));
  }, []);

  if (!segments) {
    return (
      <Popover ref={ref} {...otherProps} className="share-popover">
        <Popover.Title as="h3">Создать короткую ссылку</Popover.Title>
        <Popover.Content className="d-flex justify-content-center">
          <Spinner animation="border" />
        </Popover.Content>
      </Popover>
    );
  }

  const [base, absTime] = getBaseSegment(segments, segment, time);

  let value;

  switch (mode) {
    case 'link':
      value = getShortLink(
        includeGame && game,
        (!includeTime && segment.segment.indexOf('.') !== -1) ? segment : base,
        includeTime && absTime,
      );
      break;

    case 'mpv':
      value = getMpvCommand(segment, includeTime && time);
      break;

    default:
      value = '';
  }

  return (
    <Popover ref={ref} {...otherProps} className="share-popover">
      <Popover.Title as="h3">Создать короткую ссылку</Popover.Title>
      <Popover.Content>
        <Form.Row>
          <Col>
            <InputGroup>
              <Form.Control
                ref={inputRef}
                readOnly
                value={value}
                size="sm"
              />
              <InputGroup.Append>
                <Form.Control
                  as={Button}
                  variant="dark"
                  size="sm"
                  onClick={() => {
                    const input = inputRef.current;

                    if (input) {
                      input.select();
                      input.setSelectionRange(0, 200);
                      document.execCommand('copy');
                    }
                  }}
                >
                  <i className="fas fa-copy" />
                </Form.Control>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Form.Row>

        <Form.Row className="mt-2">
          <Col className="d-flex align-content-center">
            <Form.Check
              className="mr-2"
              type="checkbox"
              label="Начать с таймкода: "
              checked={includeTime}
              onChange={({ target: { checked } }) => setIncludeTime(checked)}
            />

            <Form.Control
              className="time-selector"
              value={ftime(time)}
              size="sm"
              readOnly
              htmlSize={4}
            />
          </Col>
        </Form.Row>

        <Form.Row className="mt-2">
          <Col>
            <Form.Check
              type="checkbox"
              label="Включить игру в ссылку"
              checked={includeGame}
              onChange={({ target: { checked } }) => setIncludeGame(checked)}
            />
          </Col>
        </Form.Row>

        <Form.Row className="mt-2">
          <Col><ModeSelector mode={mode} onChange={setMode} /></Col>
        </Form.Row>
      </Popover.Content>
    </Popover>
  );
});

ShareOverlay.propTypes = {
  game: PropTypes.string.isRequired,
  segment: PropTypes.object.isRequired,
  currentTime: PropTypes.number.isRequired,
};

export { ShareOverlay };
