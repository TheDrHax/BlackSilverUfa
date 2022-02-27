import React from 'react';
import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { faFileArchive, faRobot, faSmile } from '@fortawesome/free-solid-svg-icons';
import { TypeEmotes } from './types';
import { FAIcon } from '../../utils/fontawesome';

export const ChatSettings = ({ showHidden, emotes, showEmotes, unpackMessages, onChange }) => (
  <div className="sidebar-row border-top d-flex">
    <OverlayTrigger
      placement="top"
      overlay={(props) => (
        <Tooltip {...props}>
          Показывать ответы ботов, команды и голоса на играх с интеграцией
          чата ({showHidden ? 'включено' : 'выключено'})
        </Tooltip>
      )}
    >
      <Button
        variant="dark"
        size="sm"
        onClick={() => onChange({ showHidden: !showHidden })}
      >
        <FAIcon icon={faRobot} />
        <div className={`led ${showHidden ? 'bg-success' : 'bg-danger'}`} />
      </Button>
    </OverlayTrigger>

    <OverlayTrigger
      placement="top"
      overlay={(props) => (
        <Tooltip {...props}>
          Показывать смайлики Twitch, BetterTTV и
          FrankerFaceZ ({showEmotes ? 'включено' : 'выключено'})
        </Tooltip>
      )}
    >
      <Button
        className="ms-1"
        variant="dark"
        size="sm"
        onClick={() => onChange({ showEmotes: !showEmotes })}
      >
        {showEmotes && !emotes ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <FAIcon icon={faSmile} />
        )}
        <div className={`led ${showEmotes ? 'bg-success' : 'bg-danger'}`} />
      </Button>
    </OverlayTrigger>

    <OverlayTrigger
      placement="top"
      overlay={(props) => (
        <Tooltip {...props}>
          Распаковывать сообщения вида &quot;Kappa x3&quot; в
          &quot;Kappa Kappa Kappa&quot; ({unpackMessages ? 'включено' : 'выключено'})
        </Tooltip>
      )}
    >
      <Button
        className="ms-1"
        variant="dark"
        size="sm"
        onClick={() => onChange({ unpackMessages: !unpackMessages })}
      >
        <FAIcon icon={faFileArchive} />
        <div className={`led ${unpackMessages ? 'bg-success' : 'bg-danger'}`} />
      </Button>
    </OverlayTrigger>
  </div>
);

ChatSettings.propTypes = {
  showHidden: PropTypes.bool.isRequired,
  emotes: TypeEmotes,
  showEmotes: PropTypes.bool.isRequired,
  unpackMessages: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

ChatSettings.defaultProps = {
  emotes: null,
};
