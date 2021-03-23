import React from 'react';
import PropTypes from 'prop-types';
import Plyr from 'plyr';

export default class Player extends React.PureComponent {
  static propTypes = {
    youtube: PropTypes.string,
    direct: PropTypes.string,
    start: PropTypes.number,
    autostart: PropTypes.number,
    end: PropTypes.number,
    forceStart: PropTypes.bool,
    savedPositionAdapter: PropTypes.object,
    onReady: PropTypes.func,
    onDestroy: PropTypes.func,
    onTimeChange: PropTypes.func,
  }

  static defaultProps = {
    youtube: null,
    direct: null,
    start: 0,
    autostart: null,
    end: null,
    forceStart: false,
    savedPositionAdapter: null,
    onReady: () => null,
    onDestroy: () => null,
    onTimeChange: () => null,
  }

  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.onReady = this.onReady.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);

    this.firstTimeUpdate = true;
    this.firstReady = true;
  }

  plyrOptions() {
    return {
      // Disable quality selection (doesn't work on YouTube)
      settings: ['captions', /* 'quality', */ 'speed', 'loop'],
      invertTime: false,
      youtube: { controls: 1 },
      keyboard: { global: true },
    };
  }

  plyrSource() {
    const { youtube, direct } = this.props;
    const source = { type: 'video' };

    if (youtube) {
      source.sources = [{
        provider: 'youtube',
        src: youtube,
      }];
    } else {
      source.sources = [{
        type: 'video/mp4',
        src: direct,
      }];
    }

    return source;
  }

  onReady() {
    const { onReady, autostart } = this.props;
    const { firstReady = true } = this;

    if (firstReady) {
      this.firstReady = false;

      onReady(this.plyr);

      if (autostart) {
        this.plyr.play();
      }
    }
  }

  onTimeUpdate() {
    const {
      onTimeChange,
      forceStart,
      start,
      autostart,
      end,
      savedPositionAdapter: spa,
    } = this.props;

    const {
      plyr,
      firstTimeUpdate = true,
      lastCallback = -0.25,
      lastSave = 0,
    } = this;

    const time = plyr.currentTime;

    if (firstTimeUpdate) {
      this.firstTimeUpdate = false;

      if (time === 0) {
        if (autostart) {
          plyr.currentTime = autostart;
        } else if (spa && spa.exists()) {
          plyr.currentTime = spa.get();
        } else if (time < start) {
          plyr.currentTime = start;
        }
      }
    }

    if (forceStart && time < start) {
      plyr.currentTime = start;
    }

    if (end && time >= end) {
      plyr.currentTime = end;
      plyr.pause();
    }

    if (Math.abs(time - lastCallback) >= 0.25) {
      this.lastCallback = time;
      onTimeChange(time);
    }

    if (Math.abs(time - lastSave) >= 5) {
      this.lastSave = time;
      spa.set(time);
    }
  }

  spawnPlyr() {
    const ref = this.ref.current;

    const video = document.createElement('video');
    ref.appendChild(video);

    const plyr = new Plyr(video, this.plyrOptions());
    this.plyr = plyr;

    plyr.source = this.plyrSource();
    plyr.touch = false; // Force click and hover events on PCs with touchscreen

    // YouTube ready
    plyr.on('ready', (e) => {
      const { direct } = this.props;
      if (!direct) {
        this.onReady(e);
      }
    });

    // Direct ready
    plyr.on('loadedmetadata', (e) => {
      const { direct } = this.props;
      if (direct) {
        this.onReady(e);
      }
    });

    plyr.on('timeupdate', this.onTimeUpdate);

    // Fix instant pause by Plyr
    plyr.on('statechange', (event) => {
      if (event.detail.code === 1) plyr.play();
    });

    plyr.on('playing', () => {
      // Workaround for muted sound after seeking
      if (!plyr.muted) {
        plyr.muted = false;
      }
    });
  }

  destroyPlyr() {
    const { onDestroy } = this.props;
    onDestroy();

    this.plyr.destroy();

    const ref = this.ref.current;
    ref.removeChild(ref.querySelector('video'));
  }

  componentDidMount() {
    console.log('player mounted');
    this.spawnPlyr();
  }

  componentDidUpdate(prev) {
    const { plyr, props: next } = this;

    if (prev.youtube !== next.youtube || prev.direct !== next.direct) {
      this.firstReady = true;
      this.firstTimeUpdate = true;
      plyr.source = this.plyrSource();
    }
  }

  componentWillUnmount() {
    this.destroyPlyr();
  }

  render() {
    const { youtube } = this.props;
    return <div ref={this.ref} className={youtube ? 'plyr-youtube' : ''} />;
  }
}
