import Plyr from 'plyr';
import SubtitlesOctopus from 'libass-wasm';
import { debounce } from 'debounce';
import { Redirect } from './redirect';
import { SavedPosition } from './utils/saved-position';

function get_timecodes(id) {
  return document.querySelectorAll('.timecodes[data-id="' + id + '"] a[data-value]');
}

function spawnPlayer(wrapper, callback) {
  wrapper.classList.remove('d-flex', 'justify-content-center');
  Array.from(wrapper.children).forEach(function (e) { e.visible = false; })

  if (wrapper.dataset.youtube || wrapper.dataset.direct) {
    return spawnPlyr(wrapper, callback);
  }
}

function spawnPlyr(wrapper, callback) {
  let player, subtitles;
  let stream = wrapper.dataset;
  let timecodes = get_timecodes(stream.id);
  let ready = stream.direct ? 'loadedmetadata' : 'ready';
  let saved_pos = new SavedPosition(stream);

  const id = stream.twitch + '.' + (stream.segment || 0);
  const offset = +stream.offset || 0;
  let start = +stream.start || 0;
  const end = +stream.end || 0;
  const force_start = Boolean(stream.force_start);

  let options = {
    // Disable quality selection (doesn't work on YouTube)
    settings: ['captions', /* 'quality', */ 'speed', 'loop'],
    invertTime: false,
    duration: end > 0 ? end : undefined,
    youtube: { controls: 1 }
  };

  wrapper.innerHTML = '<video />';
  player = new Plyr(wrapper.children[0], options);

  // Force enable click and hover events on PCs with touchscreen
  player.touch = false;

  let last_timestamp = -1;
  let last_save = -1;
  let first_loop = true;

  player.on('timeupdate', function(event) {
    let time = player.currentTime;

    // Ignore first loop if time has already been modified
    first_loop &= time < 1;

    if ((first_loop || force_start) && time < start) {
      // Seek forward if start field is specified
      player.currentTime = start;
    }

    if (first_loop && saved_pos.exists()) {
      // Seek to the saved position
      player.currentTime = saved_pos.get();
    }

    first_loop = false;

    // Run only once per second
    if (Math.abs(time - last_timestamp) > 1) {
      last_timestamp = time;

      // Stop player when video exceeds overridden duration
      if (end > 0 && time >= player.config.duration) {
        player.currentTime = player.config.duration;
        player.pause();
      }
  
      // Save current position every 5 seconds
      if (Math.abs(time - last_save) > 5) {
        saved_pos.set(Math.floor(time));
        last_save = time;
      }
  
      // Change color of timecode links
      timecodes.forEach(function(el) {
        if (el.dataset.value < time) {
          if (!el.classList.contains('visited')) {
            el.classList.add('visited');
          }
        } else {
          if (el.classList.contains('visited')) {
            el.classList.remove('visited');
          }
        }
      });
    }
  });

  player.on('playing', function(event) {
    // Workaround for muted sound after seeking
    if (!player.muted) {
      player.muted = false;
    }
  });

  let source = { type: 'video' };
  if (stream.youtube) {
    source.sources = [{
      provider: 'youtube',
      src: stream.youtube
    }];
  } else {
    source.sources = [{
      type: 'video/mp4',
      src: stream.direct
    }];
  }
  player.source = source;

  if (stream.subtitles) {
    // SubtitlesOctopus uses ResizeObserver on video object,
    // but it doesn't work with Proxy objects
    window.ResizeObserver = undefined;

    // Connect Subtitles Octopus to video
    subtitles = new SubtitlesOctopus({
      // Wrapper only allows to create a correct canvas. Time tracking is
      // configured using the subtitles.setVideo() call below.
      video: player.elements.wrapper,
      subUrl: stream.subtitles,
      workerUrl: '/dist/subtitles-octopus-worker.js',
      fonts: ['/static/fonts/LiberationSans-Extended.ttf'],
      timeOffset: offset
    });

    // Subtitles are not visible when player.media.videoWidth is undefined
    subtitles.canvas.style.display = "block";
    subtitles.canvas.style.position = "absolute";
    subtitles.canvas.style.top = 0;
    subtitles.canvas.style.pointerEvents = "none";

    function subResize() {
      let e_sub = subtitles.canvas;
      let e_vid = player.elements.container;

      let width = Math.min(e_vid.clientWidth, e_vid.clientHeight / 9 * 16);
      let height = width / 16 * 9;

      // Render at double resolution for better quality
      e_sub.style.transform = 'scale(0.5, 0.5) translate(-50%, -50%)';
      subtitles.resize(width * 2, height * 2);

      // Position canvas in the center of the video
      e_sub.style.marginTop = e_vid.clientHeight / 2 - height / 2 + 'px';
      e_sub.style.marginLeft = e_vid.clientWidth / 2 - width / 2 + 'px';
    }

    window.subResize = subResize;
    player.on('enterfullscreen', subResize);
    player.on('exitfullscreen', subResize);
    window.addEventListener('resize', debounce(subResize, 100));

    // Player caption button
    player.on(ready, function(event) {
      // Set correct player element to track current time
      subtitles.setVideo(new Proxy(player.media, {
        get(obj, prop) {
          // Remove video size info for consistency with YouTube source
          if (prop === 'videoWidth' || prop === 'videoHeight') {
            return undefined;
          }

          // https://stackoverflow.com/a/59110022
          let value = Reflect.get(obj, prop);
          if (typeof (value) == "function") {
            return value.bind(obj);
          }
          return value;
        }
      }));

      let captions = player.elements.controls.childNodes[4];
      captions.toggle = function() {
        if (captions.pressed) {
          captions.pressed = false;
          subtitles.canvasParent.style.visibility = 'hidden';
        } else {
          captions.pressed = true;
          subtitles.canvasParent.style.visibility = '';
        }
      }
      captions.onclick = captions.toggle;

      // Force enable captions button
      // Also check '.plyr [data-plyr=captions]' style in styles.css
      captions.classList.add('plyr__control--pressed');
      captions.pressed = true;

      subResize();
    });
  }


  if (stream.youtube) { // Allow to switch between Plyr and YouTube
    // Fix instant pause by Plyr
    player.on('statechange', event => {
      if (event.detail.code == 1) player.play();
    });

    player.on(ready, function (event) {
      // Disable fullscreen for YouTube Player
      let iframe = wrapper.querySelector('iframe');
      iframe.allowFullscreen = false;

      // Add control button
      let controls = player.elements.controls;
      let fullscreen = controls.querySelector('button[data-plyr="fullscreen"]');

      let button = document.createElement('button');
      button.classList.add('plyr__controls__item');
      button.classList.add('plyr__control');
      button.classList.add('plyr__control--pressed');
      button.classList.add('plyr-yt-open');

      let icon = document.createElement('i');
      icon.classList.add('fab');
      icon.classList.add('fa-youtube');
      button.appendChild(icon);

      controls.insertBefore(button, fullscreen);

      // Add floating button
      let float_button = document.createElement('button');
      float_button.classList.add('btn');
      float_button.classList.add('btn-primary');
      float_button.classList.add('plyr-yt-return')
      float_button.innerText = 'Вернуться в Plyr';
      player.elements.wrapper.appendChild(float_button);

      button.onclick = function (e) {
        iframe.style.zIndex = 30;
        float_button.style.display = 'block';
      };

      float_button.onclick = function (e) {
        iframe.style.zIndex = "";
        float_button.style.display = 'none';
      }
    });
  }

  // Element controls
  wrapper.seek = function(time) {
    player.currentTime = time;
    player.play();
    return false;
  };

  if (callback != undefined) {
    player.on(ready, function (event) {
      callback(wrapper);
    })
  }

  return false;
};

window.addEventListener('DOMContentLoaded', function() {
  let streams = document.getElementsByClassName("stream");
  let hash = false;
  let spawned = false;

  if (streams.length == 0) {
    return;
  } else {
    console.log(`Initializing ${streams.length} streams`);
  }

  function parse_hash() {
    let hash = window.location.hash.replace('#', '').split('.');

    if (hash.length == 2 && hash[1] == 0) {
      window.location.hash = '#' + hash[0];
      return parse_hash();
    }

    return hash;
  }

  if (window.location.hash) {
    hash = parse_hash();
  }

  let i = 0;
  for (let wrapper of streams) {
    if (!wrapper.dataset.youtube && !wrapper.dataset.direct) {
      spawned = true;
      continue;
    }

    let button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.type = 'button';
    button.innerHTML = '<i class="fas fa-play"></i> Открыть плеер';
    button.onclick = function () {
      spawnPlayer(wrapper);
    };

    wrapper.classList.add('d-flex', 'justify-content-center');
    wrapper.appendChild(button);

    // Placeholder methods to trigger spawn of player
    wrapper.seek = function (t) {
      spawnPlayer(wrapper, function(wrapper) {
        wrapper.seek(t);
      });
    };

    // Activate timecode links
    let timecodes = get_timecodes(wrapper.dataset.id);
    let timecode_onclick = function() {
      wrapper.seek(Number(this.dataset.value));
    };
    timecodes.forEach(function(el) {
      el.onclick = timecode_onclick;
      el.href = 'javascript:void(0)';
    });

    if (hash) {
      let id = hash[0];
      if (id == i || id == wrapper.dataset.twitch) {
        let callback = function(wrapper) {
          // Trigger autoscroll again
          window.location.hash = window.location.hash;
        };

        let spawn = function() {
          spawned = true;
          spawnPlayer(wrapper, callback);
          document.title = wrapper.dataset.name + " | " + document.title;
        };

        // simple streams
        if (hash.length == 1 && wrapper.dataset.segment === undefined) {
            spawn();
        }

        // segmented streams
        if (hash.length == 2 && hash[1] == wrapper.dataset.segment) {
            spawn();
        }
      }
    }

    i++;
  }

  if (hash && !spawned) {
    Redirect.go(hash.join('.'));
  }
}, false);
