import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import last from 'lodash/last';
import { Button, ListGroup, Spinner } from 'react-bootstrap';
import { ChatMessage } from './message';
import { loadSubtitles } from './subtitles-loader';
import { Scroll } from '../scroll';
import Persist from '../../utils/persist';
import { ChatSettings } from './settings';
import { useComplexState } from '../../hooks/use-complex-state';
import { usePlyrTime } from '../../hooks/use-plyr-time';

export const Chat = ({ subtitles, plyr, offset, simple }) => {
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

  // Skip time updates if there are no new messages available
  const borders = useRef([null, null]);
  const currentTime = usePlyrTime(plyr, (t) => {
    const { current: [left, right] } = borders;

    return left != null && right != null && t >= left && t < right
      ? true
      : Math.floor(t);
  });

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
        setEmotes(res);
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

  const query = {};

  if (!settings.showHidden) {
    query.hidden = { $eq: false };
  }

  const messages = data.chain()
    .find({
      ...query,
      time: { $lte: currentTime - offset },
    })
    .offset(-200)
    .simplesort('$loki')
    .data();

  const lastMsg = last(messages);

  borders.current[0] = lastMsg ? lastMsg.time + offset : 0;

  const nextMsg = data.chain().find({
    ...query,
    $loki: { $gt: lastMsg?.$loki || 0 },
    time: { $gt: lastMsg?.time || 0 },
  }).limit(1).data()[0];

  borders.current[1] = nextMsg ? nextMsg.time + offset : null;

  return (
    <>
      <Scroll className="flex-1-0-0" keepAtBottom contentKey={lastMsg?.time}>
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
          subtitles={subtitles}
          {...settings}
        />
      )}
    </>
  );
};

Chat.propTypes = {
  subtitles: PropTypes.string.isRequired,
  plyr: PropTypes.object,
  offset: PropTypes.number,
  simple: PropTypes.bool,
};

Chat.defaultProps = {
  offset: 0,
  simple: false,
  plyr: null,
};
