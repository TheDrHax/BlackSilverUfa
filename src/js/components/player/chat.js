import React from 'react';
import PropTypes from 'prop-types';
import * as Loki from 'lokijs';
import { last } from 'lodash';
import { Button, ListGroup, ListGroupItem, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import fetchline from 'fetchline';
import Timecodes from './timecodes';
import Scroll from './scroll';

export default class Chat extends React.Component {
  static propTypes = {
    subtitles: PropTypes.string.isRequired,
    currentTime: PropTypes.number.isRequired,
    offset: PropTypes.number,
  }

  static defaultProps = {
    offset: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      error: null,
      showHidden: false,
      maxItems: 100,
    };

    this.toggleShowHidden = this.toggleShowHidden.bind(this);
    this.tryLoadData = this.tryLoadData.bind(this);
  }

  async loadData() {
    const { subtitles } = this.props;

    this.db = new Loki(last(subtitles.split('/')));
    this.data = this.db.addCollection('subtitles');

    const iterator = fetchline(subtitles);
    const lineBreak = /\\N/g;

    let firstLine = true;

    for await (let line of iterator) {
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
        const time = Timecodes.parseTime(parts[1]);

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

  componentDidUpdate(prevProps) {
    const { subtitles } = this.props;
    const { subtitles: prevSubtitles } = prevProps;

    if (subtitles !== prevSubtitles) {
      this.destroyData();
      this.tryLoadData();
    }
  }

  componentDidMount() {
    this.setState({
      showHidden: JSON.parse(localStorage.getItem('chat-messages-hidden')) || false,
    });

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

  toggleShowHidden() {
    const { showHidden } = this.state;
    this.setState({ showHidden: !showHidden });
    localStorage.setItem('chat-messages-hidden', JSON.stringify(!showHidden));
  }

  render() {
    const { loaded, error, showHidden } = this.state;

    if (error) {
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
      return (
        <div className="flex-1-0-0 d-flex flex-column justify-content-center align-items-center">
          <Spinner animation="border" role="status" />
          <span className="mt-2">Загрузка сообщений...</span>
        </div>
      );
    }

    return (
      <>
        <Scroll flex="1 0 0" keepAtBottom>
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
                {msg.text}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Scroll>

        <div className="sidebar-row border-top d-flex">
          <OverlayTrigger
            placement="top"
            overlay={(props) => (
              <Tooltip {...props}>
                {showHidden ? 'Скрывать ' : 'Показывать '}
                ботов, команды и голоса на играх с интеграцией чата
              </Tooltip>
            )}
          >
            <Button variant="dark" size="sm" onClick={this.toggleShowHidden}>
              {showHidden ? (
                <i className="far fa-eye" />
              ) : (
                <i className="far fa-eye-slash" />
              )}
            </Button>
          </OverlayTrigger>
        </div>
      </>
    );
  }
}
