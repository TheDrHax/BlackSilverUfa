import React from 'react';
import PropTypes from 'prop-types';
import * as Loki from 'lokijs';
import last from 'lodash/last';
import { Button, ListGroup, ListGroupItem, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { Img } from 'react-image';
import { ptime } from '../../utils/time-utils';
import Scroll from './scroll';
import Persist from '../../utils/persist';

const getEmoteUrl = (source, id) => {
  if (source === 'twitch') {
    return `//static-cdn.jtvnw.net/emoticons/v2/${id}/static/dark/1.0`;
  } else if (source === 'betterttv') {
    return `//cdn.betterttv.net/emote/${id}/1x`;
  } else if (source === 'frankerfacez') {
    return `//cdn.frankerfacez.com/emote/${id}/1`;
  } else {
    return '';
  }
};

const EMOTE_PRIORITIES = { // lowest priority first
  source: ['frankerfacez', 'betterttv', 'twitch'],
  scope: ['global', 'channel'],
};

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      error: null,
      maxItems: 100,
      ...Persist.load('Chat', {
        showHidden: false,
        showEmotes: true,
      }),
      emotes: null,
    };

    this.tryLoadData = this.tryLoadData.bind(this);
  }

  async loadEmotes() {
    const emotes = await fetch('/data/emotes.json').then((res) => res.json());
    const result = {};

    EMOTE_PRIORITIES.source.forEach((source) => (
      EMOTE_PRIORITIES.scope.forEach((scope) => {
        if (emotes[source] && emotes[source][scope]) {
          Object.entries(emotes[source][scope]).forEach(([name, id]) => {
            result[name] = getEmoteUrl(source, id);
          });
        }
      })
    ));

    const pattern = new RegExp(`^(${Object.keys(result).join('|')})$`);

    this.setState({
      emotes: {
        data: result,
        pattern,
      },
    });
  }

  async loadData() {
    const { subtitles } = this.props;

    this.db = new Loki(last(subtitles.split('/')));
    this.data = this.db.addCollection('subtitles', { indices: ['time'] });

    const lines = await fetch(subtitles)
      .then((res) => res.text())
      .then((res) => res.split('\n'));

    const lineBreak = /\\N/g;

    let firstLine = true;

    for (let line of lines) {
      if (firstLine) {
        if (!line.startsWith('[Script Info]')) {
          throw new Error('Файл повреждён или недоступен');
        }

        firstLine = false;
      }

      const hidden = line.startsWith('; ');

      if (hidden) {
        line = line.substr(2);
      }

      if (line.startsWith('Dialogue: ')) {
        const parts = line.substr(10).split(', ');

        const [userStr, ...msgParts] = parts.slice(3).join(' ').split(': ');
        const text = msgParts.join(': ').replace(lineBreak, '');
        const time = ptime(parts[1]);

        let user = userStr;
        let color = 'inherit';

        if (userStr.startsWith('{\\c&H')) {
          user = userStr.substr(13, userStr.length - 13 * 2);

          // BGR to RGB
          color = userStr.substr(9, 2) + userStr.substr(7, 2) + userStr.substr(5, 2);
          color = `#${color}`;

          if (color === '#FFFFFF') {
            color = 'inherit';
          }
        }

        this.data.insert({ time, user, text, color, hidden });
      }
    }

    this.setState({
      loaded: true,
    });
  }

  async tryLoadData() {
    this.setState({
      loaded: false,
      error: null,
    });

    try {
      await this.loadData();
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }

    try {
      await this.loadEmotes();
    // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  destroyData() {
    this.setState({ loaded: false });

    if (this.db) {
      this.db.clearChanges();
      this.db.close();
      this.data = null;
      this.db = null;
    }
  }

  shouldComponentUpdate(prevProps, nextState) {
    Persist.save('Chat', this.state, nextState, [
      'showHidden',
    ]);

    return true;
  }

  componentDidUpdate(prevProps) {
    const { subtitles } = this.props;
    const { subtitles: prevSubtitles } = prevProps;

    if (subtitles !== prevSubtitles) {
      this.destroyData();
      this.tryLoadData();
    }
  }

  componentDidMount() {
    this.tryLoadData();
  }

  componentWillUnmount() {
    this.destroyData();
  }

  getMessages() {
    const { currentTime, offset } = this.props;
    const { maxItems, showHidden } = this.state;

    const query = { time: { $lte: currentTime - offset } };

    if (!showHidden) {
      query.hidden = { $eq: false };
    }

    return this.data.chain().find(query).offset(-maxItems).data();
  }

  renderMessageText(text) {
    const { showEmotes, emotes } = this.state;

    if (!showEmotes || !emotes) return text;

    const { pattern, data } = emotes;

    return text.split(/\s+/).map((word, i) => {
      if (word.match(pattern)) {
        word = (
          <Img
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            src={data[word]}
            className="emote"
            loader={<span className="emote-placeholder" />}
            unloader={word}
          />
        );
      }

      return [i > 0 && ' ', word];
    });
  }

  renderMessages() {
    return (
      <ListGroup className="chat-messages-list">
        {this.getMessages().map((msg) => (
          <ListGroupItem key={msg.$loki}>
            <span
              style={{ color: msg.color }}
              className="username"
            >
              {msg.user}
            </span>
            {': '}
            {this.renderMessageText(msg.text)}
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }

  renderScrollable() {
    return (
      <Scroll flex="1 0 0" keepAtBottom>
        {this.renderMessages()}
      </Scroll>
    );
  }

  render() {
    const { loaded, error, showHidden, showEmotes } = this.state;
    const { simple } = this.props;

    if (error) {
      if (simple) {
        return null;
      }

      return (
        <div className="flex-1-0-0 d-flex flex-column justify-content-center align-items-center">
          <span>Ошибка: {error}</span>
          <Button
            variant="primary"
            className="mt-2"
            onClick={this.tryLoadData}
          >
            Попробовать снова
          </Button>
        </div>
      );
    }

    if (!loaded) {
      if (simple) {
        return null;
      }

      return (
        <div className="flex-1-0-0 d-flex flex-column justify-content-center align-items-center">
          <Spinner animation="border" role="status" />
          <span className="mt-2">Загрузка сообщений...</span>
        </div>
      );
    }

    if (simple) {
      return this.renderScrollable();
    }

    return (
      <>
        {this.renderScrollable()}

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
              onClick={() => this.setState({ showHidden: !showHidden })}
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
              onClick={() => this.setState({ showEmotes: !showEmotes })}
            >
              <i className="fas fa-smile" />
              <div className={`led ${showEmotes ? 'bg-success' : 'bg-danger'}`} />
            </Button>
          </OverlayTrigger>
        </div>
      </>
    );
  }
}

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
