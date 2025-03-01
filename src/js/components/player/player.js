import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Plyr from 'plyr';
import Hls from 'hls.js';
import Measure from 'react-measure';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import Persist from '../../utils/persist';
import 'plyr/src/sass/plyr.scss';
import { FAIcon } from '../../utils/fontawesome';

export default class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...Persist.load('Player', {
        chatOverlay: true,
      }),
    };

    this.ref = React.createRef();
    this.overlay = document.createElement('div');
    this.overlay.className = 'plyr-overlay';

    this.onReady = this.onReady.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onVideoEnded = this.onVideoEnded.bind(this);
    this.onFullScreenEnter = this.onFullScreenEnter.bind(this);
    this.onFullScreenExit = this.onFullScreenExit.bind(this);

    this.firstTimeUpdate = true;
    this.firstReady = true;

    this.hls = null;
  }

  plyrOptions() {
    return {
      // Disable quality selection (doesn't work on YouTube)
      settings: ['captions', /* 'quality', */ 'speed', 'loop'],
      invertTime: false,
      seekTime: 5, // same as YouTube
      youtube: {
        controls: 1,
        fs: false,
        disablekb: 0,
        cc_load_policy: 0,
      },
      keyboard: { global: true },
    };
  }

  updatePlyrSource() {
    const { youtube, direct, hls } = this.props;
    const { media: video } = this.plyr;
    const source = { type: 'video' };

    if (this.hls) {
      this.hls?.destroy();
      delete this.hls;
    }

    if (youtube) {
      source.sources = [{
        provider: 'youtube',
        src: youtube,
      }];
    } else if (hls && Hls.isSupported()) {
      const hlsClient = new Hls({
        // For videos starting without a keyframe (first keyframe is
        // located typically at 2.015)
        maxBufferHole: 5,
      });
      hlsClient.loadSource(hls);
      hlsClient.attachMedia(video);
      this.hls = hlsClient;

      return;
    } else {
      source.sources = [{
        type: 'video/mp4',
        src: direct,
      }];
    }

    this.plyr.source = source;
  }

  addControlButton({
    before = 'button[data-plyr="fullscreen"]',
    icon = faComments,
    value = true,
    onToggle = (state) => state,
  }) {
    const { controls } = this.plyr.elements;

    const button = document.createElement('button');
    [
      'plyr__controls__item',
      'plyr__control',
      'plyr__control__custom',
    ].forEach((i) => button.classList.add(i));

    const node = document.createElement('span');
    button.appendChild(node);
    ReactDOM.render(<FAIcon icon={icon} />, node); // this works? nice

    if (value) {
      button.pressed = true;
      button.classList.add('plyr__control--pressed');
    } else {
      button.pressed = false;
    }

    button.onclick = () => {
      if (button.pressed) {
        button.pressed = false;
        button.classList.remove('plyr__control--pressed');
      } else {
        button.pressed = true;
        button.classList.add('plyr__control--pressed');
      }

      onToggle(button.pressed);
    };

    const nextNode = controls.querySelector(before);
    controls.insertBefore(button, nextNode);
  }

  onReady() {
    const { onReady, autostart } = this.props;
    const { chatOverlay } = this.state;
    const { firstReady = true } = this;

    if (firstReady) {
      this.firstReady = false;

      this.addControlButton({
        before: '.plyr__menu',
        icon: faComments,
        value: chatOverlay,
        onToggle: (value) => {
          this.setState({ chatOverlay: value });
        },
      });

      onReady(this.plyr);

      if (autostart) {
        this.plyr.play()?.catch(() => null);
      }
    }
  }

  onTimeUpdate() {
    const {
      forceStart,
      start,
      end,
      savedPositionAdapter: spa,
    } = this.props;

    const {
      plyr,
      firstReady = true,
      firstTimeUpdate = true,
      lastSave = 0,
    } = this;

    const time = plyr.currentTime;

    if (!firstReady && firstTimeUpdate) {
      this.firstTimeUpdate = false;

      const saved = spa?.get() || 0;

      if (start > 0) {
        plyr.currentTime = start;
      } else if (saved > 0) {
        plyr.currentTime = Math.min(saved, plyr.duration - 30);
      }
    }

    if (forceStart && time < start) {
      plyr.currentTime = start;
    }

    if (end && time >= end) {
      plyr.currentTime = end;
      plyr.pause();
    }

    if (Math.abs(time - lastSave) >= 5) {
      this.lastSave = time;
      spa.set(time);
    }
  }

  onVideoEnded() {
    const {
      onVideoEnded,
      savedPositionAdapter: spa,
    } = this.props;

    const { plyr } = this;
    const time = plyr.currentTime;

    if (spa) {
      spa.set(time, { end: true });
    }

    onVideoEnded();
  }

  onFullScreenEnter() {
    const { onFullScreen } = this.props;
    onFullScreen(true);
  }

  onFullScreenExit() {
    const { onFullScreen } = this.props;
    onFullScreen(false);
  }

  spawnPlyr() {
    const ref = this.ref.current;

    const video = document.createElement('video');
    ref.appendChild(video);

    const plyr = new Plyr(video, this.plyrOptions());
    this.plyr = plyr;

    plyr.elements.container.appendChild(this.overlay);

    this.updatePlyrSource();
    plyr.touch = false; // Force click and hover events on PCs with touchscreen

    const { poster } = this.props;
    plyr.poster = poster;

    // YouTube ready
    plyr.on('ready', (e) => {
      const { direct } = this.props;
      if (!direct) {
        this.onReady(e);
      }
    });

    // Direct ready
    plyr.on('loadedmetadata', (e) => {
      const { direct, hls } = this.props;
      if (direct || hls) {
        this.onReady(e);
      }
    });

    plyr.on('timeupdate', this.onTimeUpdate);

    // Fix instant pause by Plyr
    plyr.on('statechange', (event) => {
      if (event.detail.code === 1) plyr.play()?.catch(() => null);
    });

    plyr.on('playing', () => {
      // Workaround for muted sound after seeking
      if (!plyr.muted) {
        plyr.muted = false;
      }

      // Workaround for volume desync
      if (plyr.embed) {
        plyr.volume = plyr.embed.getVolume() / 100;
      }
    });

    // Workaround for exiting fullscreen after pressing Space
    plyr.on('enterfullscreen', () => {
      this.plyr.elements.buttons.play[1].focus();
    });

    plyr.on('ended', this.onVideoEnded);
    plyr.on('enterfullscreen', this.onFullScreenEnter);
    plyr.on('exitfullscreen', this.onFullScreenExit);
  }

  destroyPlyr() {
    const { onDestroy } = this.props;
    onDestroy();

    this.hls?.destroy();
    this.plyr?.destroy();

    const ref = this.ref.current;
    ref.removeChild(ref.querySelector('video'));
  }

  componentDidMount() {
    this.spawnPlyr();
  }

  shouldComponentUpdate(prevProps, nextState) {
    Persist.save('Player', this.state, nextState, [
      'chatOverlay',
    ]);

    return true;
  }

  componentDidUpdate(prev) {
    const { plyr, props: next } = this;

    if (prev.youtube !== next.youtube
        || prev.direct !== next.direct
        || prev.poster !== next.poster) {
      this.firstReady = true;
      this.firstTimeUpdate = true;
      this.updatePlyrSource();
      plyr.poster = next.poster;
    }
  }

  componentWillUnmount() {
    this.destroyPlyr();
  }

  render() {
    const { renderOverlay } = this.props;
    const { chatOverlay } = this.state;

    return (
      <>
        {ReactDOM.createPortal(
          <Measure>
            {({ contentRect: { entry }, measureRef }) => (
              <div className="plyr-overlay" ref={measureRef}>
                {chatOverlay && renderOverlay(entry)}
              </div>
            )}
          </Measure>,
          this.overlay,
        )}
        <div ref={this.ref} className="plyr-row" />
      </>
    );
  }
}

Player.propTypes = {
  youtube: PropTypes.string,
  direct: PropTypes.string,
  hls: PropTypes.string,
  poster: PropTypes.string,
  start: PropTypes.number,
  autostart: PropTypes.bool,
  end: PropTypes.number,
  forceStart: PropTypes.bool,
  savedPositionAdapter: PropTypes.shape({
    get: PropTypes.func,
    set: PropTypes.func,
  }),
  onReady: PropTypes.func,
  onDestroy: PropTypes.func,
  onFullScreen: PropTypes.func,
  onVideoEnded: PropTypes.func,
  renderOverlay: PropTypes.func,
};

Player.defaultProps = {
  youtube: null,
  direct: null,
  hls: null,
  poster: null,
  start: 0,
  autostart: false,
  end: null,
  forceStart: false,
  savedPositionAdapter: null,
  onReady: () => null,
  onDestroy: () => null,
  onFullScreen: () => null,
  onVideoEnded: () => null,
  renderOverlay: () => null,
};
