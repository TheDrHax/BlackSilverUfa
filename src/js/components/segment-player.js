import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Col,
  ListGroup,
  OverlayTrigger,
  Ratio,
  Row,
  Tab,
  Tabs,
  Tooltip,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { Rnd } from 'react-rnd';
import { faCaretSquareLeft, faCaretSquareRight, faCheckCircle, faDownload, faExclamationCircle, faExpand, faMaximize, faShareSquare } from '@fortawesome/free-solid-svg-icons';
import { faTwitch, faYoutube, faVk } from '@fortawesome/free-brands-svg-icons';
import { Data } from '../data';
import Persist from '../utils/persist';
import { Chat } from './chat';
import Player from './player/player';
import { Timecodes } from './player/timecodes';
import { Scroll } from './scroll';
import { Playlist } from './player/playlist';
import Reparentable from './utils/reparentable';
import SugarDate from '../utils/sugar';
import ErrorPage from '../pages/error-page';
import updateState from '../utils/update-state';
import { findRefBySegment, resolveGame, resolveSegment } from '../utils/data-utils';
import { ShareOverlay } from './player/share-overlay';
import { Layout } from '.';
import { FAIcon } from '../utils/fontawesome';
import { NoPrerender } from '../utils/prerender';
import PATHS from '../constants/urls';

export default class SegmentPlayer extends React.Component {
  createChatContainer() {
    const chatContainer = document.createElement('div');

    chatContainer.style.height = '100%';
    chatContainer.style.display = 'flex';
    chatContainer.style.flexDirection = 'column';

    return chatContainer;
  }

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      error: false,
      fullscreen: false,
      segment: null,
      segmentRef: null,
      relatedGames: null,
      timecodes: null,
      plyr: null,
      toggleFullscreen: () => null,
      ...Persist.load('SegmentPlayer', {
        chatOverlay: {
          width: null,
          height: null,
          x: null,
          y: null,
        },
        sidebarCollapsed: false,
      }),
    };

    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.renderPlayerOverlay = this.renderPlayerOverlay.bind(this);

    this.chatContainer = this.createChatContainer();
  }

  resolveUrl({ segments, games }) {
    const { location } = this.props;
    const { search: reqSearch, state: reqState } = location;
    const search = new URLSearchParams(reqSearch);
    const paramAt = search.has('at') ? +search.get('at') : null;

    let {
      match: {
        params: {
          game: gameId,
          segment: segmentId,
        },
      },
    } = this.props;

    const [segment, at, t] = resolveSegment(segments, segmentId, paramAt);

    if (!segment) {
      return null;
    }

    let redirect = segment.segment !== segmentId;

    segmentId = segment.segment;

    let game = games.by('id', gameId);
    let segmentRef;

    // Handle missing or unknown game
    if (!game || segment.games.indexOf(gameId) === -1) {
      [game, segmentRef] = resolveGame(games, segment, at);
      gameId = game.id;
      redirect = true;
    } else {
      segmentRef = findRefBySegment(game, segment);
    }

    const newLocation = {
      ...location,
      pathname: `/play/${gameId}/${segment.segment}`,
      search: `?at=${at}`
    };

    return {
      segment,
      game,
      segmentRef,
      start: t,
      autostart: reqState?.autostart,
      redirect: redirect && newLocation,
    };
  }

  loadData() {
    Data.then(({ segments, timecodes, games }) => {
      const { history } = this.props;
      const request = this.resolveUrl({ segments, games });

      if (!request) {
        this.setState({ error: true });
        return;
      }

      if (request.redirect) {
        history.replace(request.redirect);
      }

      const {
        game,
        segment,
        segmentRef,
        start,
        autostart,
      } = request;

      let relatedGames = segment.games.map((gameId) => games.by('id', gameId));

      if (relatedGames.length === 0) {
        relatedGames = null;
      }

      this.setState({
        loaded: true,
        error: false,
        segment,
        game,
        segmentRef,
        relatedGames,
        start,
        autostart,
      });

      timecodes.then((data) => {
        this.setState({
          timecodes: data[segment.segment],
        });
      });
    });
  }

  componentDidMount() {
    this.loadData();
  }

  shouldComponentUpdate(prevProps, nextState) {
    Persist.save('SegmentPlayer', this.state, nextState, [
      'chatOverlay',
      'sidebarCollapsed',
    ]);

    return true;
  }

  componentDidUpdate(prevProps) {
    const { match: { params } } = this.props;
    const { match: { params: prevParams } } = prevProps;

    if (params.segment !== prevParams.segment) {
      this.loadData();
    } else if (params.game !== prevParams.game) {
      this.loadData();
    }
  }

  toggleSidebar() {
    const { sidebarCollapsed } = this.state;

    if (!sidebarCollapsed) { // collapse immediately
      const { pointerEvents } = document.body.style;

      // release focus
      document.activeElement.blur();

      // release hover for 100ms
      document.body.style.pointerEvents = 'none';
      setTimeout(() => {
        document.body.style.pointerEvents = pointerEvents;
      }, 100);
    }

    this.setState({ sidebarCollapsed: !sidebarCollapsed });
  }

  renderPlayer() {
    const {
      history,
    } = this.props;

    const {
      game,
      segment,
      segmentRef,
      segmentRef: {
        end,
        force_start: forceStart,
      },
      segment: {
        youtube, direct, hls, poster,
      },
      start,
      autostart,
    } = this.state;

    const playerProps = {
      youtube,
      direct,
      poster,
      hls,
      start,
      autostart,
      end,
      forceStart,
      savedPositionAdapter: {
        get: () => segment.watched,
        set: segment.setWatched,
      },
      onVideoEnded: () => {
        const nextIndex = game.streams.indexOf(segmentRef) + 1;
        if (nextIndex < game.streams.length) {
          history.push(game.streams[nextIndex].url);
        }
      },
      onReady: (plyr) => {
        this.setState({
          plyr,
          toggleFullscreen: (forceFallback = false) => {
            plyr.fullscreen.forceFallback = forceFallback;
            plyr.fullscreen.toggle();
            plyr.elements.container.focus();
          },
        });
      },
      onFullScreen: (fullscreen) => this.setState({ fullscreen }),
      onDestroy: () => this.setState({
        plyr: null,
        toggleFullscreen: () => null,
      }),
      renderOverlay: this.renderPlayerOverlay,
    };

    return (
      <Row>
        <Col>
          <Ratio aspectRatio="16x9">
            <NoPrerender>
              <Player {...playerProps} />
            </NoPrerender>
          </Ratio>
        </Col>
      </Row>
    );
  }

  renderPlayerOverlay({ width, height }) {
    const {
      fullscreen,
      segment: {
        subtitles,
      },
      chatOverlay: ol,
    } = this.state;

    if (!fullscreen || !subtitles) {
      return null;
    }

    return (
      <Rnd
        className="chat-overlay"
        position={{
          x: ol.x !== null ? ol.x * width : 0,
          y: ol.y !== null ? ol.y * height : 0.65 * height,
        }}
        minWidth="100px"
        minHeight="100px"
        size={{
          width: ol.width ? `${ol.width * 100}%` : '35%',
          height: ol.height ? `${ol.height * 100}%` : '35%',
        }}
        onDragStop={(e, { x, y }) => {
          updateState(this, {
            chatOverlay: {
              $merge: {
                x: x / width,
                y: y / height,
              },
            },
          });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          updateState(this, {
            chatOverlay: {
              $merge: {
                width: ref.offsetWidth / width,
                height: ref.offsetHeight / height,
                x: position.x / width,
                y: position.y / height,
              },
            },
          });
        }}
        bounds="parent"
      >
        {this.renderChat()}
      </Rnd>
    );
  }

  renderPlayerControls() {
    const {
      toggleFullscreen,
      segment,
      plyr,
    } = this.state;

    const {
      segment: segmentId,
      youtube,
      vk,
      official,
      torrent,
    } = segment;

    const oldStream = SugarDate.monthsAgo(segment.date) >= 2;

    return (
      <Row className="g-0">
        <Col>
          <div className="player-controls border-top border-bottom">
            {oldStream || (
              <Button variant="dark" size="sm" className="me-2" href={`https://twitch.tv/videos/${segmentId}`} target="blank">
                <FAIcon icon={faTwitch} />
                <span>Twitch</span>
              </Button>
            )}

            {youtube && (
              <Button
                href={`https://youtu.be/${youtube}`}
                target="blank"
                variant="dark"
                size="sm"
                className="me-2"
              >
                <FAIcon icon={faYoutube} />
                <span>YouTube</span>
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip>
                      {official === false ? 'Неофициальный канал' : 'Официальный канал'}
                    </Tooltip>
                  )}
                >
                  <FAIcon
                    icon={official === false ? faExclamationCircle : faCheckCircle}
                    className={official === false ? 'text-warning' : 'text-success'}
                  />
                </OverlayTrigger>
              </Button>
            )}

            {vk && (
              <Button
                href={`https://vk.com/video${vk}`}
                target="blank"
                variant="dark"
                size="sm"
                className="me-2"
              >
                <FAIcon icon={faVk} />
                <span>ВК</span>
              </Button>
            )}

            {torrent && (
              <Button
                href={torrent}
                variant="dark"
                size="sm"
                className="me-2"
              >
                <FAIcon icon={faDownload} />
                <span className="d-none d-xl-inline">Торрент</span>
              </Button>
            )}

            <div className="flex-grow-1" />

            <OverlayTrigger
              trigger="click"
              rootClose
              placement="top"
              overlay={(
                <ShareOverlay
                  segment={segment}
                  plyr={plyr}
                />
              )}
            >
              <Button variant="dark" size="sm" className="me-2">
                <FAIcon icon={faShareSquare} />
                <span className="d-none d-xl-inline">Поделиться</span>
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={(props) => (
                <Tooltip {...props}>
                  Оставить в окне только плеер, но не переходить в полноэкранный режим
                </Tooltip>
              )}
            >
              <Button variant="dark" size="sm" onClick={() => toggleFullscreen(true)} className="me-2">
                <FAIcon icon={faMaximize} />
                <span className="d-none d-lg-inline">На всё окно</span>
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={(props) => (
                <Tooltip {...props}>
                  Развернуть плеер на весь экран
                </Tooltip>
              )}
            >
              <Button variant="dark" size="sm" onClick={() => toggleFullscreen(false)}>
                <FAIcon icon={faExpand} />
                <span className="d-none d-lg-inline">На весь экран</span>
              </Button>
            </OverlayTrigger>
          </div>
        </Col>
      </Row>
    );
  }

  renderChat() {
    const {
      fullscreen,
      plyr,
      segment: {
        subtitles,
        abs_start: absStart,
      },
    } = this.state;

    const header = (
      <div className="sidebar-header">
        Чат
      </div>
    );

    if (!subtitles) {
      return (
        <>
          {header}
          <div className="p-4 flex-grow-1 align-self-center text-white">
            Для этого стрима нет записи чата :(
          </div>
        </>
      );
    }

    return (
      <NoPrerender>
        {!fullscreen && header}
        <Chat
          plyr={plyr}
          offset={-absStart}
          subtitles={subtitles}
          simple={fullscreen}
        />
      </NoPrerender>
    );
  }

  renderTimecodes() {
    const { timecodes, plyr } = this.state;

    return (
      <>
        <div className="sidebar-header">
          Таймкоды
        </div>
        <Scroll className="flex-1-1-0">
          <Timecodes
            data={timecodes}
            plyr={plyr}
          />
        </Scroll>
      </>
    );
  }

  renderPlaylist({ autoExpand = false, fullHeight = false } = {}) {
    const {
      segment,
      game,
      relatedGames,
    } = this.state;

    if (!relatedGames) return null;

    return (
      <>
        <div className="sidebar-header">
          Плейлист
        </div>
        <Playlist
          games={relatedGames}
          game={game}
          segment={segment}
          {...{ autoExpand, fullHeight }}
        />
      </>
    );
  }

  renderLeftSidebar() {
    const {
      sidebarCollapsed,
      timecodes,
      relatedGames,
      segment: {
        subtitles,
      },
    } = this.state;

    const leftSidebarClasses = [
      'col-sidebar-narrow border-end',
      sidebarCollapsed ? 'collapsed' : '',
    ].join(' ');

    if (!subtitles) { // move all content to right sidebar
      return null;
    }

    return (
      <>
        {(timecodes || relatedGames) && (
          <MediaQuery minDeviceWidth={1200}>
            <Col className={leftSidebarClasses} tabIndex="0">
              <div className="content">
                <div className="sidebar-row-overlay flex-row-reverse">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={this.toggleSidebar}
                  >
                    <FAIcon icon={sidebarCollapsed ? faCaretSquareRight : faCaretSquareLeft} />
                  </Button>
                </div>

                {relatedGames && this.renderPlaylist()}
                {timecodes && this.renderTimecodes()}
              </div>

              <div className="collapsed-content">
                {relatedGames && (
                  <div className="sidebar-header">Плейлист</div>
                )}
                {timecodes && (
                  <div className="sidebar-header">Таймкоды</div>
                )}
              </div>
            </Col>
          </MediaQuery>
        )}

        {(timecodes || relatedGames) && (
          <MediaQuery minDeviceWidth={768} maxDeviceWidth={1199}>
            <Col className="col-sidebar-narrow collapsed" tabIndex="0">
              <div className="content border-end">
                {relatedGames && this.renderPlaylist()}
                {timecodes && this.renderTimecodes()}
              </div>

              <div className="collapsed-content">
                {relatedGames && (
                  <div className="sidebar-header">Плейлист</div>
                )}
                {timecodes && (
                  <div className="sidebar-header">Таймкоды</div>
                )}
              </div>
            </Col>
          </MediaQuery>
        )}
      </>
    );
  }

  renderRightSidebar() {
    const {
      chatContainer,
      state: {
        fullscreen,
        relatedGames,
        timecodes,
        segment: {
          subtitles,
        },
      },
    } = this;

    if (!subtitles && !relatedGames && !timecodes) {
      return null;
    }

    return (
      <MediaQuery minDeviceWidth={768}>
        <Col className="col-sidebar-wide border-start">
          {(subtitles && !fullscreen) && (
            <Reparentable el={chatContainer} className="flex-1-1-0" />
          )}
          {(!subtitles && relatedGames) && this.renderPlaylist()}
          {(!subtitles && timecodes) && this.renderTimecodes()}
        </Col>
      </MediaQuery>
    );
  }

  renderDescription() {
    const {
      game,
      segment,
      segmentRef,
    } = this.state;

    return (
      <Row className="stream-description">
        <Col>
          <h3>
            <Link to={`/play/${game.id}`}>{game.name}</Link>
            <span> — </span>
            <span className="flex-grow-1">{segmentRef.name}</span>
          </h3>

          <ListGroup variant="flush" size="sm">
            <ListGroup.Item>
              Дата стрима:
              {' '}
              {SugarDate.medium(segment.date)}
              {' '}
              ({SugarDate.relative(segment.date)})
            </ListGroup.Item>

            {(segment.note && (
              <ListGroup.Item
                dangerouslySetInnerHTML={{ __html: segment.note }}
              />
            ))}
          </ListGroup>
        </Col>
      </Row>
    );
  }

  renderBelowPlayer() {
    const {
      chatContainer,
      state: {
        fullscreen,
        relatedGames,
        timecodes,
        segment: {
          subtitles,
        },
      },
    } = this;

    return (
      <>
        <MediaQuery minDeviceWidth={768}>
          {this.renderDescription()}
        </MediaQuery>

        <MediaQuery maxDeviceWidth={767}>
          <MediaQuery maxDeviceWidth={575}>
            {(subtitlesInTab) => (
              <Row className="flex-grow-1 flex-shrink-1 g-0">
                <Col className="sidebar-content">
                  <Tabs mountOnEnter>
                    <Tab eventKey="description" title="Описание">
                      {!subtitlesInTab ? (
                        <Scroll className="flex-1-1-0">
                          {this.renderDescription()}
                        </Scroll>
                      ) : this.renderDescription()}
                    </Tab>

                    {timecodes && (
                      <Tab eventKey="timecodes" title="Таймкоды">
                        {this.renderTimecodes()}
                      </Tab>
                    )}

                    {relatedGames && (
                      <Tab eventKey="playlist" title="Плейлист" unmountOnExit>
                        {this.renderPlaylist({
                          autoExpand: true,
                          fullHeight: true,
                        })}
                      </Tab>
                    )}

                    {subtitles && subtitlesInTab && (
                      <Tab eventKey="chat" title="Чат">
                        {!fullscreen && (
                          <Reparentable el={chatContainer} className="flex-1-1-0" />
                        )}
                      </Tab>
                    )}
                  </Tabs>
                </Col>

                {subtitles && !subtitlesInTab && (
                  <Col className="sidebar-content border-start">
                    {!fullscreen && (
                      <Reparentable el={chatContainer} className="flex-1-1-0" />
                    )}
                  </Col>
                )}
              </Row>
            )}
          </MediaQuery>
        </MediaQuery>
      </>
    );
  }

  render() {
    const { loaded, error } = this.state;

    if (error) {
      return <ErrorPage />;
    }

    if (!loaded) {
      return <Layout fluid flex withFooter={false} isLoading />;
    }

    const {
      chatContainer,
      state: {
        segment: {
          segment: segmentId,
          subtitles,
          thumbnail,
          date,
        },
        segmentRef: {
          name: refName,
        },
        game: {
          id: gameId,
          name: gameName,
        },
      },
    } = this;

    const title = `${refName} | ${gameName}`;
    const canonicalPath = PATHS.PLAYER
      .replace(':game', gameId)
      .replace(':segment', segmentId);

    return (
      <Layout fluid flex withFooter={false} {...{ title, canonicalPath }}>
        <Helmet>
          <meta
            property="og:description"
            content={`Запись стрима от ${SugarDate.medium(date)}`}
          />
          {thumbnail.startsWith('http') && (
            <meta property="og:image" content={thumbnail} />
          )}
        </Helmet>

        {subtitles && ReactDOM.createPortal(this.renderChat(), chatContainer)}

        <Row className="flex-grow-1 g-0">
          {this.renderLeftSidebar()}

          <Col className="d-flex flex-column">
            {this.renderPlayer()} {/* Can't be moved without reloading */}
            {this.renderPlayerControls()}
            {this.renderBelowPlayer()}
          </Col>

          {this.renderRightSidebar()}
        </Row>
      </Layout>
    );
  }
}
