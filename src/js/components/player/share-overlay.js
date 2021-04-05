import React from 'react';
import { Button, Col, Form, InputGroup, Popover } from 'react-bootstrap';

const ShareOverlay = React.forwardRef((props, ref) => {
  const {
    game,
    segment,
    offset,
    currentTime,
    ...otherProps
  } = props;

  const inputRef = React.useRef();
  const [time, setTime] = React.useState(Math.floor(currentTime));
  const [includeTime, setIncludeTime] = React.useState(true);

  let baseUrl = `https://bsu.us.to/${game}/${segment}`;

  if (includeTime) {
    baseUrl += `?at=${time - offset}`;
  }

  return (
    <Popover ref={ref} {...otherProps}>
      <Popover.Title as="h3">Создать короткую ссылку</Popover.Title>
      <Popover.Content>
        <Form.Row>
          <Col>
            <InputGroup>
              <Form.Control ref={inputRef} readOnly value={baseUrl} />
              <InputGroup.Append>
                <Form.Control
                  as={Button}
                  variant="dark"
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

        <Form.Row>
          <Form.Check
            className="m-2"
            type="checkbox"
            label="Начать с текущего момента"
            checked={includeTime}
            onChange={({ target: { checked } }) => setIncludeTime(checked)}
          />
        </Form.Row>
      </Popover.Content>
    </Popover>
  );
});

export { ShareOverlay };
