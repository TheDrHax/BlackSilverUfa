import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse, ListGroup, ListGroupItem } from 'react-bootstrap';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ptime } from '../../utils/time-utils';
import { FAIcon } from '../../utils/fontawesome';
import { usePlyrTime } from '../../hooks/use-plyr-time';

const TimecodeLink = ({ value, plyr }) => {
  const valueInt = useMemo(() => ptime(value), [value]);
  const visited = usePlyrTime(plyr, (t) => t >= valueInt) >= valueInt;

  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (!plyr) return;
    plyr.currentTime = valueInt;
    plyr.play();
  }, [plyr, valueInt]);

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      href="#"
      className={visited ? 'visited' : ''}
      onClick={handleClick}
    >
      {value}
    </a>
  );
};

TimecodeLink.propTypes = {
  value: PropTypes.string.isRequired,
  plyr: PropTypes.object,
};

TimecodeLink.defaultProps = {
  plyr: null,
};

const DangerSpan = ({ children }) => (
  <span dangerouslySetInnerHTML={{ __html: children }} />
);

export const Timecodes = React.forwardRef(({ className, data, ...rest }, ref) => (
  <ListGroup ref={ref} className={['timecodes-list', className].join(' ')}>
    {Object.entries(data).map(([key, value]) => {
      if (typeof value === 'string') { // regular timecode
        if (key.indexOf('~') === -1) { // simple time
          return (
            <ListGroup.Item key={key}>
              {<TimecodeLink value={key} {...rest} />}
              {' — '}
              <DangerSpan>{value}</DangerSpan>
            </ListGroup.Item>
          );
        } else { // time range
          const [start, end] = key.split('~');

          return (
            <ListGroup.Item key={key}>
              {<TimecodeLink value={start} {...rest} />}
              {' - '}
              {<TimecodeLink value={end} {...rest} />}
              {' — '}
              <DangerSpan>{value}</DangerSpan>
            </ListGroup.Item>
          );
        }
      } else if (Array.isArray(value)) {
        const links = value
          .map((t) => {
            if (t.indexOf('~') === -1) { // simple time
              return <TimecodeLink key={t} value={t} {...rest} />;
            } else { // time range
              const [start, end] = t.split('~');
              return (
                <span key={t}>
                  {<TimecodeLink value={start} {...rest} />}
                  {' - '}
                  {<TimecodeLink value={end} {...rest} />}
                </span>
              );
            }
          })
          .reduce((prev, curr) => [prev, ', ', curr]);

        return (
          <ListGroup.Item key={value.join()}>
            {links}
            {' — '}
            <DangerSpan>{key}</DangerSpan>
          </ListGroup.Item>
        );
      } else { // nested timecode
        return (
          <NestedTimecodes
            key={key}
            name={key}
            data={value}
            {...rest}
          />
        );
      }
    })}
  </ListGroup>
));

Timecodes.propTypes = {
  className: PropTypes.string,
  plyr: PropTypes.object,
  data: PropTypes.object.isRequired,
};

Timecodes.defaultProps = {
  className: '',
  plyr: null,
};

const NestedTimecodes = ({ name, level, ...rest }) => {
  const [open, setOpen] = useState(true);
  const toggleState = useCallback(() => setOpen(!open), [open]);

  return (
    <>
      <ListGroupItem
        className="d-flex"
        action
        onClick={toggleState}
      >
        <FAIcon icon={open ? faChevronDown : faChevronRight} />
        <b>{name}</b>
      </ListGroupItem>
      <Collapse in={open}>
        <Timecodes
          className={`timecodes-nested-${level}`}
          level={level + 1}
          {...rest}
        />
      </Collapse>
    </>
  );
};

NestedTimecodes.propTypes = {
  name: PropTypes.string.isRequired,
  level: PropTypes.number,
};

NestedTimecodes.defaultProps = {
  level: 0,
};
