import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, InputGroup, Pagination, Popover, Row, Spinner } from 'react-bootstrap';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { getBaseSegment } from '../../utils/data-utils';
import { Data } from '../../data';
import { ftime } from '../../utils/time-utils';
import { FAIcon } from '../../utils/fontawesome';
import { Segment } from '../../data-types';
import { usePlyrTime } from '../../hooks/use-plyr-time';
import config from '../../../../config/config.json';

const getShortLink = (segment, at) => (
  // eslint-disable-next-line prefer-template
  (config.prefix || window.location.origin)
  + '/r/'
  + segment.segment
  + (at ? `?at=${at}` : '')
);

const getMpvCommand = (segment, t) => (
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
  chat: 'Чат',
  mpv: 'MPV',
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

const ShareOverlay = React.forwardRef(({ segment, plyr, ...otherProps }, ref) => {
  const inputRef = useRef();
  const time = Math.floor(usePlyrTime(plyr, (t) => Math.round(t)));
  const [mode, setMode] = useState('link');
  const [segments, setSegments] = useState(null);
  const [includeTime, setIncludeTime] = useState(time > 0);

  useEffect(() => {
    Data.then(({ segments: s }) => setSegments(s));
  }, []);

  if (!segments) {
    return (
      <Popover ref={ref} {...otherProps} className="share-popover">
        <Popover.Header as="h3">Создать короткую ссылку</Popover.Header>
        <Popover.Body className="d-flex justify-content-center">
          <Spinner animation="border" />
        </Popover.Body>
      </Popover>
    );
  }

  const [baseId, absTime] = getBaseSegment(segment, time);
  const base = segments.by('segment', baseId);

  let value;

  switch (mode) {
    case 'link':
      value = getShortLink(
        (!includeTime && segment.segment.indexOf('.') !== -1) ? segment : base,
        includeTime && absTime,
      );
      break;

    case 'mpv':
      value = getMpvCommand(segment, includeTime && time);
      break;

    case 'chat':
      value = `!запись ${base.segment}${includeTime ? (` ${absTime}`) : ''}`;
      break;

    default:
      value = '';
  }

  return (
    <Popover ref={ref} {...otherProps} className="share-popover">
      <Popover.Header as="h3">Создать короткую ссылку</Popover.Header>
      <Popover.Body>
        <Row>
          <Col>
            <InputGroup>
              <Form.Control
                ref={inputRef}
                readOnly
                value={value}
                size="sm"
              />
              <Button
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
                <FAIcon icon={faCopy} />
              </Button>
            </InputGroup>
          </Col>
        </Row>

        <Row className="mt-2">
          <Col className="d-flex align-content-center">
            <Form.Check
              className="me-auto"
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
        </Row>

        <Row className="mt-2">
          <Col><ModeSelector mode={mode} onChange={setMode} /></Col>
        </Row>
      </Popover.Body>
    </Popover>
  );
});

ShareOverlay.propTypes = {
  segment: Segment.isRequired,
  plyr: PropTypes.object,
};

ShareOverlay.defaultProps = {
  plyr: null,
};

export { ShareOverlay };
