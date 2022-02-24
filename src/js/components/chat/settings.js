import React from 'react';
import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

export const ChatSettings = ({ showHidden, showEmotes, unpackMessages, onChange }) => (
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
        <i className="fas fa-robot" />
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
        <i className="fas fa-smile" />
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
        <i className="fas fa-file-archive" />
        <div className={`led ${unpackMessages ? 'bg-success' : 'bg-danger'}`} />
      </Button>
    </OverlayTrigger>
  </div>
);

ChatSettings.propTypes = {
  showHidden: PropTypes.bool.isRequired,
  showEmotes: PropTypes.bool.isRequired,
  unpackMessages: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
