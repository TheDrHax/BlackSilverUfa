import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, ListGroup, Spinner } from 'react-bootstrap';
import { ChatMessage } from './message';
import { loadSubtitles } from './subtitles-loader';
import Scroll from '../scroll';
import Persist from '../../utils/persist';
import { ChatSettings } from './settings';
import { useComplexState } from '../../hooks/use-complex-state';

export const Chat = ({ subtitles, currentTime, offset, simple }) => {
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [emotes, setEmotes] = useState();
  const [settings, updateSettings] = useComplexState(
    Persist.load('Chat', {
      showHidden: false,
      showEmotes: true,
      unpackMessages: true,
    }),
  );

  useEffect(() => {
    Persist.save('Chat', {}, settings, Object.keys(settings));
  }, [settings]);

  useEffect(() => {
    if (error) return null;

    loadSubtitles(subtitles)
      .then((res) => setData(res))
      .catch((e) => setError(e.message));

    return () => data && data.clear();
  }, [subtitles, error]);

  useEffect(() => {
    if (emotes || !settings.showEmotes) return;

    fetch('/data/emotes.json')
      .then((res) => res.json())
      .then((res) => {
        const pattern = new RegExp(`^(${Object.keys(res).join('|')})$`);
        setEmotes({ data: res, pattern });
      })
      .catch(() => setEmotes(null));
  }, [settings.showEmotes]);

  if (error) {
    return !simple && (
      <div className="flex-1-0-0 d-flex flex-column justify-content-center align-items-center">
        <span>Ошибка: {error}</span>
        <Button
          variant="primary"
          className="mt-2"
          onClick={() => setError(null)}
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (!data) {
    return !simple && (
      <div className="flex-1-0-0 d-flex flex-column justify-content-center align-items-center">
        <Spinner animation="border" role="status" />
        <span className="mt-2">Загрузка сообщений...</span>
      </div>
    );
  }

  const query = { time: { $lte: currentTime - offset } };

  if (!settings.showHidden) {
    query.hidden = { $eq: false };
  }

  const messages = data.chain().find(query).offset(-50).data();

  return (
    <>
      <Scroll flex="1 0 0" keepAtBottom>
        <ListGroup className="chat-messages-list">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.$loki}
              message={msg}
              emotes={emotes}
              {...settings}
            />
          ))}
        </ListGroup>
      </Scroll>

      {!simple && (
        <ChatSettings
          onChange={updateSettings}
          emotes={emotes}
          {...settings}
        />
      )}
    </>
  );
};

Chat.propTypes = {
  subtitles: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
  offset: PropTypes.number,
  simple: PropTypes.bool,
};

Chat.defaultProps = {
  offset: 0,
  simple: false,
};
