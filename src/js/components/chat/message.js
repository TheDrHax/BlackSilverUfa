import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import repeat from 'lodash/repeat';
import { ListGroupItem } from 'react-bootstrap';
import { Img } from 'react-image';
import { TypeMessage } from './types';

const PACKED_WORDS = /([^ ]+) x⁣([0-9]+)/g;

const unpackMessage = (text) => (
  text.replace(PACKED_WORDS, (a, b, c) => repeat(`${b} `, c).trimEnd())
);

export const ChatMessage = ({ message, emotes, unpackMessages, showHidden, showEmotes }) => {
  if (message.hidden && !showHidden) return null;

  const body = useMemo(() => {
    let res = message.text;

    if (unpackMessages) {
      res = unpackMessage(res);
    }

    if (showEmotes && emotes) {
      res = res.split(/\s+/).map((word, i) => {
        if (word.match(emotes.pattern)) {
          word = (
            <Img
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              src={emotes.data[word]}
              className="emote"
              loader={<span className="emote-placeholder" />}
              unloader={word}
            />
          );
        }

        return [i > 0 && ' ', word];
      });
    }

    return res;
  }, [message.text, unpackMessages, emotes, showEmotes]);

  return (
    <ListGroupItem>
      <span
        style={{ color: message.color }}
        className="username"
      >
        {message.user}
      </span>
      {': '}
      {body}
    </ListGroupItem>
  );
};

ChatMessage.propTypes = {
  message: TypeMessage.isRequired,
  emotes: PropTypes.shape({
    pattern: PropTypes.object,
    data: PropTypes.objectOf(PropTypes.string),
  }),
  unpackMessages: PropTypes.bool.isRequired,
  showHidden: PropTypes.bool.isRequired,
  showEmotes: PropTypes.bool.isRequired,
};

ChatMessage.defaultProps = {
  emotes: null,
};
