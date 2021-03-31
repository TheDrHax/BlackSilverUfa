import { find } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Accordion,
  Button,
  Col,
  ListGroup,
  OverlayTrigger,
  Row,
  Tab,
  Tabs,
  Tooltip,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { Rnd } from 'react-rnd';
import { Data } from '../data';
import SavedPosition from '../utils/saved-position';
import BasePage from './base-page';
import Chat from './player/chat';
import Player from './player/player';
import Timecodes from './player/timecodes';
import Scroll from './player/scroll';
import Playlist from './player/playlist';
import Reparentable from './utils/reparentable';
import config from '../../../config/config.json';
import BigSpinner from './big-spinner';
import Matomo from '../matomo';

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
      fullscreen: false,
      segment: null,
      segmentRef: null,
      playlist: null,
      relatedRefs: null,
      timecodes: null,
      currentTime: 0,
      setTime: null,
      playlistAccordion: null,
      sidebarCollapsed: false, // TODO: сохранять состояние в localStorage
    };

    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.renderPlayerOverlay = this.renderPlayerOverlay.bind(this);
    this.onPlaylistAccordionSelect = this.onPlaylistAccordionSelect.bind(this);

    this.chatContainer = this.createChatContainer();
  }

  resolveUrl({ segments, games }) {
    const { location: { search: reqSearch } } = this.props;
    const search = new URLSearchParams(reqSearch);
    const params = {
      at: +search.get('at'),
      t: +search.get('t'),
    };
    let redirect = false;
    let {
      match: {
        params: {
          game: gameId,
          segment: segmentId,
        },
      },
    } = this.props;

    // Handle missing segments
    if (!segments.by('segment', segmentId)) {
      let found = false;

      if (segmentId.indexOf(',') !== -1) {
        const joinedParts = segmentId.split(',');

        for (let i = 0; i < joinedParts.length; i += 1) {
          const part = joinedParts[i];

          if (segments.by('segment', part)) {
            segmentId = part;
            redirect = true;
            found = true;
            break;
          }
        }
      } else if (segmentId.indexOf('.') !== -1) {
        const mainSegment = segmentId.substr(0, segmentId.indexOf('.'));

        if (segments.by('segment', mainSegment)) {
          segmentId = mainSegment;
          redirect = true;
          found = true;
        }
      }

      if (!found) {
        return null;
      }
    }

    // Handle segments without refs
    if (segments.by('segment', segmentId).games.length === 0) {
      let found = false;

      // Redirect to joined streams
      const candidates = segments.chain()
        .find({ segment: { $contains: ',' } })
        .where((s) => s.segment.split(',').indexOf(segmentId) !== -1)
        .data()
        .map((s) => s.segment);

      if (candidates.length > 0) {
        const oldSegmentId = segmentId;
        [segmentId] = candidates;
        redirect = true;
        found = true;

        // Rebase timestamp
        if (params.at) {
          const segment = segments.by('segment', segmentId);
          const index = segmentId.split(',').indexOf(oldSegmentId);

          const t = params.at;
          let offset = segment.offsets[index];

          if (segment.cuts) {
            segment.cuts
              .filter(([start, end]) => end <= t + offset)
              .forEach(([start, end]) => {
                offset -= end - start;
              });
          }

          params.at = t + offset;
          redirect = true;
        }
      }

      if (!found) {
        return null;
      }
    }

    const segment = segments.by('segment', segmentId);

    // Handle missing or unknown game
    if (!games.by('id', gameId) || segment.games.indexOf(gameId) === -1) {
      [gameId] = segments.by('segment', segmentId).games;
      redirect = true;
    }

    const game = games.by('id', gameId);
    const segmentRef = find(game.streams, (ref) => ref.segment === segmentId);

    let newUrl = null;

    if (redirect) {
      newUrl = `/play/${gameId}/${segmentId}`;
      if (params.at) {
        newUrl += `?at=${params.at}`;
      } else if (params.t) {
        newUrl += `?t=${params.t}`;
      }
    }

    return {
      segment,
      game,
      segmentRef,
      params,
      redirect: newUrl,
    };
  }

  loadData() {
    Data.then(({ segments, timecodes, games }) => {
      const { history } = this.props;
      const request = this.resolveUrl({ segments, games });

      if (!request) {
        history.replace('/404');
        return;
      }

      if (request.redirect) {
        history.replace(request.redirect);
      }

      const {
        game,
        segment,
        segmentRef,
        params,
      } = request;

      const playlist = game.streams.map((ref) => ({
        ref,
        segment: segments.by('segment', ref.segment),
      }));

      let relatedRefs = segment.games.map((gameId) => {
        const relatedGame = games.by('id', gameId);

        return find(
          relatedGame.streams,
          (ref) => ref.segment === segment.segment,
        );
      });

      if (relatedRefs.length === 0) {
        relatedRefs = null;
      }

      document.title = `${segmentRef.name} | ${game.name} | ${config.title}`;

      Matomo.trackPageView();

      this.setState({
        loaded: true,
        segment,
        game,
        segmentRef,
        playlist,
        relatedRefs,
        params,
        savedPositionAdapter: new SavedPosition(segment),
        timecodes: timecodes[segment.segment],
      });
    });
  }

  componentDidMount() {
    this.loadData();
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
      segmentRef: {
        start, end,
        force_start: forceStart,
      },
      segment: {
        youtube, direct,
        abs_start: offset,
      },
      params: {
        t, at,
      },
      savedPositionAdapter,
    } = this.state;

    let autostart = null;

    if (at) {
      autostart = at - offset;
    } else if (t) {
      autostart = t;
    }

    const playerProps = {
      youtube,
      direct,
      start,
      autostart,
      end,
      forceStart,
      savedPositionAdapter,
      onTimeChange: (time) => this.setState({ currentTime: time }),
      onReady: (plyr) => {
        this.setState({
          setTime: (ts) => {
            plyr.currentTime = ts;
            plyr.play();
          },
          toggleFullscreen: () => plyr.fullscreen.toggle(),
        });
      },
      onFullScreen: (fullscreen) => this.setState({ fullscreen }),
      onDestroy: () => this.setState({
        setTime: null,
        currentTime: 0,
      }),
      renderOverlay: this.renderPlayerOverlay,
    };

    return (
      <Row>
        <Col>
          <Player {...playerProps} />
        </Col>
      </Row>
    );
  }

  renderPlayerOverlay() {
    const {
      fullscreen,
      segment: {
        subtitles,
      },
    } = this.state;

    if (!fullscreen || !subtitles) {
      return null;
    }

    return (
      <Rnd
        className="chat-overlay"
        default={{
          x: 0,
          y: 0,
          width: 240,
          height: '80%',
        }}
        bounds="parent"
      >
        {this.renderChat()}
      </Rnd>
    );
  }

  renderPlayerControls() {
    const { toggleFullscreen } = this.state;

    return (
      <Row className="no-gutters">
        <Col>
          <div className="player-controls border-top border-bottom">
            <div className="flex-grow-1" />
            <OverlayTrigger
              placement="top"
              overlay={(props) => (
                <Tooltip {...props}>
                  Развернуть плеер на весь экран
                </Tooltip>
              )}
            >
              <Button variant="dark" size="sm" onClick={toggleFullscreen}>
                <i className="fas fa-expand" />
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
      currentTime,
      segment: {
        subtitles,
        abs_start: absStart,
      },
    } = this.state;

    const header = (
      <div className="sidebar-header border-bottom border-top">
        Запись чата
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
      <>
        {!fullscreen && header}
        <Chat
          currentTime={currentTime}
          offset={-absStart}
          subtitles={subtitles}
          simple={fullscreen}
        />
      </>
    );
  }

  renderTimecodes() {
    const {
      timecodes, setTime, currentTime,
    } = this.state;

    return (
      <>
        <div className="sidebar-header border-bottom border-top">
          Таймкоды
        </div>
        <Scroll flex="1 1 0">
          <Timecodes
            data={timecodes}
            setTime={setTime}
            currentTime={currentTime}
          />
        </Scroll>
      </>
    );
  }

  onPlaylistAccordionSelect(eventKey) {
    this.setState({ playlistAccordion: eventKey });
  }

  renderPlaylist({ forceExpanded = false, fullHeight = false } = {}) {
    const {
      game,
      relatedRefs,
      segmentRef,
      playlist,
      playlistAccordion,
    } = this.state;

    if (!playlist && !relatedRefs) return null;

    const playlistComp = (
      playlist && (
        <Playlist
          items={playlist}
          activeItem={find(playlist, ({ ref }) => ref === segmentRef)}
          forceExpanded={forceExpanded}
          fullHeight={fullHeight}
          opened={playlistAccordion === 'streams'}
        />
      )
    );

    return (
      <>
        <div className="sidebar-header border-top border-bottom">
          Плейлист
        </div>
        <Accordion onSelect={this.onPlaylistAccordionSelect}>
          {relatedRefs && (
            <>
              <div className="playlist-game">
                <Accordion.Toggle
                  as={Button}
                  variant="dark"
                  size="sm"
                  className="border-bottom current-game"
                  eventKey="game"
                >
                  {game.name}
                </Accordion.Toggle>
              </div>
              <Accordion.Collapse eventKey="game">
                <ListGroup className="playlist">
                  {relatedRefs.map((ref) => (
                    <ListGroup.Item
                      action
                      key={ref.game.id}
                      as={Link}
                      to={ref.url}
                      active={ref === segmentRef}
                    >
                      {ref.game.type === 'list' ? ref.name : ref.game.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Collapse>
            </>
          )}
          {playlist && !forceExpanded && playlistComp}
        </Accordion>
        {playlist && forceExpanded && playlistComp}
      </>
    );
  }

  renderLeftSidebar() {
    const {
      sidebarCollapsed,
      timecodes,
      playlist,
      relatedRefs,
      segment: {
        subtitles,
      },
    } = this.state;

    const leftSidebarClasses = [
      'col-sidebar border-right',
      sidebarCollapsed ? 'collapsed' : '',
    ].join(' ');

    if (!subtitles) { // move all content to right sidebar
      return null;
    }

    return (
      <>
        {(timecodes || playlist) && (
          <MediaQuery minDeviceWidth={1200}>
            <Col className={leftSidebarClasses} tabIndex="0">
              <div className="sidebar-row-overlay flex-row-reverse">
                <Button
                  variant="link"
                  size="sm"
                  onClick={this.toggleSidebar}
                >
                  {sidebarCollapsed ? (
                    <i className="fas fa-caret-square-right" />
                  ) : (
                    <i className="fas fa-caret-square-left" />
                  )}
                </Button>
              </div>

              {(playlist || relatedRefs) && this.renderPlaylist()}
              {timecodes && this.renderTimecodes()}

              <div className="collapsed-content">
                {(playlist || relatedRefs) && (
                  <div className="sidebar-header">Плейлист</div>
                )}
                {timecodes && (
                  <div className="sidebar-header">Таймкоды</div>
                )}
              </div>
            </Col>
            {sidebarCollapsed && (
              <div className="sidebar-placeholder" />
            )}
          </MediaQuery>
        )}

        {(timecodes || playlist) && (
          <MediaQuery minDeviceWidth={768} maxDeviceWidth={1199}>
            <Col className="col-sidebar border-right collapsed" tabIndex="0">
              {(playlist || relatedRefs) && this.renderPlaylist()}
              {timecodes && this.renderTimecodes()}

              <div className="collapsed-content">
                {(playlist || relatedRefs) && (
                  <div className="sidebar-header">Плейлист</div>
                )}
                {timecodes && (
                  <div className="sidebar-header">Таймкоды</div>
                )}
              </div>
            </Col>
            <div className="sidebar-placeholder" />
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
        playlist,
        relatedRefs,
        timecodes,
        segment: {
          subtitles,
        },
      },
    } = this;

    if (!subtitles && !playlist && !timecodes) {
      return null;
    }

    return (
      <MediaQuery minDeviceWidth={768}>
        <Col className="col-sidebar-wide border-left">
          {(subtitles && !fullscreen) && (
            <Reparentable el={chatContainer} className="flex-1-1-0" />
          )}
          {(!subtitles && (playlist || relatedRefs)) && this.renderPlaylist()}
          {(!subtitles && timecodes) && this.renderTimecodes()}
        </Col>
      </MediaQuery>
    );
  }

  renderBelowPlayer() {
    const {
      chatContainer,
      state: {
        game,
        segmentRef,
        fullscreen,
        playlist,
        timecodes,
        segment: {
          subtitles,
        },
      },
    } = this;

    let tabsDefaultKey = 'chat';

    if (!subtitles) {
      if (timecodes) {
        tabsDefaultKey = 'timecodes';
      } else {
        tabsDefaultKey = 'playlist';
      }
    }

    return (
      <>
        <Row>
          <Col>
            <div className="stream-header border-bottom">
              <Link to={`/play/${game.id}`}>{game.name}</Link>
              <span>—</span>
              <span className="flex-grow-1">{segmentRef.name}</span>
            </div>
          </Col>
        </Row>

        {(subtitles && (timecodes || playlist)) && (
          <MediaQuery minDeviceWidth={576} maxDeviceWidth={767}>
            <Row className="no-gutters flex-grow-1 flex-shrink-1">
              <Col className="sidebar-content">
                {playlist && this.renderPlaylist()}
                {timecodes && this.renderTimecodes()}
              </Col>
              <Col className="sidebar-content border-left">
                {!fullscreen && (
                  <Reparentable el={chatContainer} className="flex-1-1-0" />
                )}
              </Col>
            </Row>
          </MediaQuery>
        )}

        {(!subtitles && (timecodes || playlist)) && (
          <MediaQuery minDeviceWidth={576} maxDeviceWidth={767}>
            <Row className="no-gutters flex-grow-1 flex-shrink-1">
              {playlist && (
                <Col className="sidebar-content border-right">
                  {this.renderPlaylist({
                    forceExpanded: true,
                    fullHeight: true,
                  })}
                </Col>
              )}

              {timecodes && (
                <Col className="sidebar-content">
                  {this.renderTimecodes()}
                </Col>
              )}
            </Row>
          </MediaQuery>
        )}

        {(timecodes || playlist || subtitles) && (
          <MediaQuery maxDeviceWidth={575}>
            <Row className="flex-grow-1 flex-shrink-1">
              <Col className="sidebar-content">
                <Tabs defaultActiveKey={tabsDefaultKey} mountOnEnter>
                  {timecodes && (
                    <Tab eventKey="timecodes" title="Таймкоды">
                      {this.renderTimecodes()}
                    </Tab>
                  )}

                  {playlist && (
                    <Tab eventKey="playlist" title="Плейлист">
                      {this.renderPlaylist({
                        forceExpanded: true,
                        fullHeight: true,
                      })}
                    </Tab>
                  )}

                  {subtitles && (
                    <Tab eventKey="chat" title="Запись чата">
                      {!fullscreen && (
                        <Reparentable el={chatContainer} className="flex-1-1-0" />
                      )}
                    </Tab>
                  )}
                </Tabs>
              </Col>
            </Row>
          </MediaQuery>
        )}
      </>
    );
  }

  render() {
    const { loaded } = this.state;

    if (!loaded) {
      return <BigSpinner />;
    }

    const {
      chatContainer,
      state: {
        segment: {
          subtitles,
        },
      },
    } = this;

    return (
      <BasePage fluid flex noFooter>
        {subtitles && ReactDOM.createPortal(this.renderChat(), chatContainer)}

        <Row className="flex-grow-1 no-gutters">
          {this.renderLeftSidebar()}

          <Col className="d-flex flex-column">
            {this.renderPlayer()} {/* Can't be moved without reloading */}
            {this.renderPlayerControls()}
            {this.renderBelowPlayer()}
          </Col>

          {this.renderRightSidebar()}
        </Row>
      </BasePage>
    );
  }
}
