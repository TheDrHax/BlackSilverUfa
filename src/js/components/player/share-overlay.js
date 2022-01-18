import React from 'react';
import PropTypes from 'prop-types';
import { sum, reverse, range, padStart } from 'lodash';
import { Button, Col, Form, InputGroup, Popover } from 'react-bootstrap';

function ptime(t) {
  return sum(reverse(t.split(':')).map((x, i) => x * 60 ** i));
}

function ftime(t) {
  return range(2, -1, -1).map((i) => {
    const res = Math.floor(t / 60 ** i);
    t %= 60 ** i;
    return padStart(res, 2, '0');
  }).join(':');
}

const ShareOverlay = React.forwardRef((props, ref) => {
  const {
    game,
    segment,
    offset,
    currentTime,
    ...otherProps
  } = props;

  const inputRef = React.useRef();
  const time = Math.floor(currentTime);
  const [includeTime, setIncludeTime] = React.useState(currentTime > 0);
  const [includeGame, setIncludeGame] = React.useState(false);

  let baseUrl = 'https://drhx.ru/b';

  if (includeGame) {
    baseUrl += `/${game}`;
  }

  baseUrl += `/${segment}`;

  if (includeTime) {
    baseUrl += `?at=${time + offset}`;
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
  segment: PropTypes.string.isRequired,
  offset: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
};

export { ShareOverlay };
