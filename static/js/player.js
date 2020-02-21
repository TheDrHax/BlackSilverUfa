// Source: https://stackoverflow.com/a/43245016
function debounce(func, wait, immediate) {
  var timeout;
  return () => {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function get_timecodes(id) {
  return document.querySelectorAll('.timecodes[data-id="' + id + '"] a[data-value]');
}

const resume = JSON.parse(localStorage.getItem("resume_playback")) || {};

function spawnPlayer(wrapper, callback) {
  if (wrapper.dataset.youtube || wrapper.dataset.direct) {
    return spawnPlyr(wrapper, callback);
  }
}

function spawnPlyr(wrapper, callback) {
  var player, subtitles;
  var stream = wrapper.dataset;
  var timecodes = get_timecodes(stream.id);

  const id = stream.twitch + '.' + (stream.segment || 0);
  const offset = +stream.offset || 0;
  var start = +stream.start || 0;
  const end = +stream.end || 0;
  const force_start = Boolean(stream.force_start);

  var options = {
    // Disable quality selection (doesn't work on YouTube)
    settings: ['captions', /* 'quality', */ 'speed', 'loop'],
    invertTime: false,
    duration: end > 0 ? end : undefined
  };

  wrapper.innerHTML = '<video />';
  player = new Plyr(wrapper.children[0], options);

  // Force enable click and hover events on PCs with touchscreen
  player.touch = false;

  var last_timestamp = -1;
  player.on('timeupdate', function(event) {
    var time = Math.floor(player.currentTime);

    // Run only once per second
    if (time != last_timestamp) {
      last_timestamp = time;
    } else {
      return;
    }

    // Stop player when video exceeds overridden duration
    if (end > 0 && time >= player.config.duration) {
      player.currentTime = player.config.duration;
      player.pause();
    }

    // Save current position every 5 seconds
    if (time % 5 == 0) {
      resume[id] = time - offset;
      localStorage.setItem('resume_playback', JSON.stringify(resume));
    }

    // Seek forward if start field is specified
    if (time < start) {
      player.currentTime = start;

      if (!force_start) {
        start = 0; // Seek to the start only one time
      }
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
  });

  player.on('playing', function(event) {
    // Workaround for muted sound after seeking
    if (!player.muted) {
      player.muted = false;
    }
  });

  var source = { type: 'video' };
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

  // Connect Subtitles Octopus to video
  subtitles = new SubtitlesOctopus({
    // Wrapper allows to track player's size and position but time tracking
    // will not work. See subtitles.setVideo() call below.
    video: player.elements.wrapper,
    subUrl: stream.subtitles,
    workerUrl: '/static/js/subtitles-octopus-worker.js',
    timeOffset: offset
  });

  // Player caption button
  player.on('ready', function(event) {
    // Set correct player element to track current time
    subtitles.setVideo(player.media);

    var captions = player.elements.controls.childNodes[4];
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
  });

  if (stream.youtube) {
    // Fix Subtitles Octopus to work with embedded YouTube videos
    // TODO: Fix subtitles position in fullscreen mode
    function subResize(event) {
      var e_sub = subtitles.canvas;
      var e_vid = player.elements.wrapper;

      e_sub.style.display = "block";
      e_sub.style.top = 0;
      e_sub.style.position = "absolute";
      e_sub.style.pointerEvents = "none";

      e_sub.width = e_vid.clientWidth * 2;
      e_sub.height = e_vid.clientHeight * 2;
      e_sub.style.transform = "scale(0.5, 0.5) translate(-50%, -50%)";

      subtitles.resize(e_sub.width, e_sub.height);
    }

    player.on('ready', subResize);
    player.on('enterfullscreen', subResize);
    player.on('exitfullscreen', subResize);
    window.addEventListener('resize', debounce(subResize, 100, false));

    // Trigger seeking to the last position saved by YouTube
    player.on('ready', function (event) {
      player.play();
      player.pause();
    });
  }

  // Element controls
  wrapper.seek = function(time) {
    player.currentTime = time;
    start = 0; // ignore 'start' attribute
    player.play();
    return false;
  };

  if (callback != undefined) {
    function ready(event) {
      // Seek to the saved position
      if (resume[id]) {
        player.currentTime = resume[id] + offset;
      }

      callback(wrapper);
    }
    
    if (stream.direct) {
      player.on('loadedmetadata', ready);
    } else {
      player.on('ready', ready);
    }
  }

  return false;
};

window.addEventListener('DOMContentLoaded', function() {
  let streams = document.getElementsByClassName("stream");
  let hash = false;
  let spawned = false;

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
    wrapper.innerHTML = '<button type="button" class="btn btn-primary">\
                             <i class="fas fa-play"></i> Открыть плеер\
                             </button>';
    wrapper.children[0].onclick = function() {
      spawnPlayer(wrapper);
    };

    // Placeholder methods to trigger spawn of player
    wrapper.seek = function (t) {
      spawnPlayer(wrapper, function(wrapper) {
        wrapper.seek(t);
      });
    };

    // Activate timecode links
    var timecodes = get_timecodes(wrapper.dataset.id);
    var timecode_onclick = function() {
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
