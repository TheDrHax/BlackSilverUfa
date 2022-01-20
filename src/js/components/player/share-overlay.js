import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, InputGroup, Popover, Spinner } from 'react-bootstrap';
import { getBaseSegment } from '../../utils/data-utils';
import { Data } from '../../data';
import { ftime } from '../../utils/time-utils';

const ShareOverlay = React.forwardRef((props, ref) => {
  const {
    game,
    segment,
    currentTime,
    ...otherProps
  } = props;

  const inputRef = useRef();
  const time = Math.floor(currentTime);
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

  let baseUrl = 'https://drhx.ru/b';

  if (includeGame) {
    baseUrl += `/${game}`;
  }

  if (!includeTime && segment.segment.indexOf('.') !== -1) {
    baseUrl += `/${segment.segment}`;
  } else {
    baseUrl += `/${base.segment}`;
  }

  if (includeTime) {
    baseUrl += `?at=${absTime}`;
  }

  return (
    <Popover ref={ref} {...otherProps} className="share-popover">
      <Popover.Title as="h3">Создать короткую ссылку</Popover.Title>
      <Popover.Content>
        <Form.Row>
          <Col>
            <InputGroup>
              <Form.Control ref={inputRef} readOnly value={baseUrl} size="sm" />
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
