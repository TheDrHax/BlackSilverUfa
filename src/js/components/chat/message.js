import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import repeat from 'lodash/repeat';
import { ListGroupItem, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TypeMessage, TypeEmotes } from './types';
import { renderTemplate } from '../../utils/text-utils';

const PACKED_WORDS = /([^ ]+) x⁣([0-9]+)/g;

const unpackMessage = (text) => (
  text.replace(PACKED_WORDS, (a, b, c) => repeat(`${b} `, c).trimEnd())
);

const badgeDescription = (name, value) => {
  switch (name) {
    case 'subscriber':
      return renderTemplate('Подписчик ({n} месяц{n#,а,ев})', { n: +value });
    
    case 'vip':
      return 'VIP';
    
    case 'broadcaster':
      return 'Стример';
    
    case 'moderator':
      return 'Модератор';
    
    default:
      return 'Unknown';
  }
};

export const ChatMessage = ({ message, emotes, unpackMessages, showHidden, showEmotes, showBadges }) => {
  if (message.hidden && !showHidden) return null;

  const body = useMemo(() => {
    let res = message.text;

    if (unpackMessages) {
      res = unpackMessage(res);
    }

    if (showEmotes && emotes) {
      res = res.split(/\s+/).map((word, i) => {
        const name = word;

        if (emotes[name]) {
          word = (
            <OverlayTrigger
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              placement="top"
              overlay={(props) => (
                <Tooltip {...props}>
                  {name}
                </Tooltip>
              )}
            >
              <img
                src={emotes[name].src}
                alt={name}
                className="emote"
              />
            </OverlayTrigger>
          );
        }

        return [i > 0 && ' ', word];
      });
    }

    return res;
  }, [message.text, unpackMessages, emotes, showEmotes]);

  const badges = useMemo(() => (
    Object.entries(message.badges).map(([name, value]) => (
      <OverlayTrigger
        key={`badge-${name}`}
        placement="top"
        overlay={(props) => (
          <Tooltip {...props}>
            {badgeDescription(name, value)}
          </Tooltip>
        )}
      >
        <img
          src={`/static/images/badge-${name}.png`}
          className="chat-badge"
          alt={name}
        />
      </OverlayTrigger>
    ))
  ), [message.badges]);

  return (
    <ListGroupItem>
      {showBadges && badges}
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
  emotes: TypeEmotes,
  unpackMessages: PropTypes.bool.isRequired,
  showHidden: PropTypes.bool.isRequired,
  showEmotes: PropTypes.bool.isRequired,
  showBadges: PropTypes.bool.isRequired,
};

ChatMessage.defaultProps = {
  emotes: null,
};
