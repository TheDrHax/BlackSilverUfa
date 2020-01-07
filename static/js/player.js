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
  return document.querySelectorAll('.timecode[data-id="' + id + '"]');
}

function spawnPlayer(wrapper, callback) {
  if (wrapper.dataset.youtube || wrapper.dataset.direct) {
    return spawnPlyr(wrapper, callback);
  }
}

function spawnPlyr(wrapper, callback) {
  var player, subtitles;
  var stream = wrapper.dataset;
  var timecodes = get_timecodes(stream.id);

  var options = {
    // Disable quality seletion (doesn't work on YouTube)
    settings: ['captions', /* 'quality', */ 'speed', 'loop'],
    invertTime: false
  };
  if (wrapper.dataset.end) {
    options.duration = +wrapper.dataset.end;
  }

  wrapper.innerHTML = '<video />';
  player = new Plyr(wrapper.children[0], options);

  // Force enable click and hover events on PCs with touchscreen
  player.touch = false;

  player.on('timeupdate', function(event) {
    // Stop player when video exceeds overriden duration
    if (wrapper.dataset.end) {
      if (player.currentTime >= player.config.duration) {
        player.currentTime = player.config.duration;
        player.pause();
      }
    }

    if (wrapper.dataset.start) {
      var start = +wrapper.dataset.start;

      if (player.currentTime != NaN && player.currentTime < start) {
        player.currentTime = start;
        wrapper.dataset.start = false; // Seek to the start only one time
      }
    }

    // Change color of timecode links
    timecodes.forEach(function(el) {
      if (el.dataset.value < player.currentTime) {
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
  if (wrapper.dataset.youtube) {
    source.sources = [{
      provider: 'youtube',
      src: wrapper.dataset.youtube
    }];
  } else {
    source.sources = [{
      type: 'video/mp4',
      src: wrapper.dataset.direct
    }];
  }
  player.source = source;

  // Connect Subtitles Octopus to video
  var subtitles_options = {
    // Wrapper allows to track player's size and position but time tracking
    // will not work. See subtitles.setVideo() call below.
    video: player.elements.wrapper,
    subUrl: wrapper.dataset.subtitles,
    workerUrl: '/static/js/subtitles-octopus-worker.js',
  };
  if (wrapper.dataset.offset) {
    subtitles_options.timeOffset = +wrapper.dataset.offset;
  }
  subtitles = new SubtitlesOctopus(subtitles_options);

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

  if (wrapper.dataset.youtube) {
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

    // Workaround for starting video from saved position
    function playpause(event) {
      player.play();
      player.pause();
    }
    player.on('ready', playpause);
  }

  // Element controls
  wrapper.seek = function(time) {
    player.currentTime = time;
    wrapper.dataset.start = false; // ignore 'start' attribute
    player.play();
    return false;
  };

  if (callback != undefined) {
    if (wrapper.dataset.direct) {
      player.on('loadedmetadata', function(event) { callback(wrapper); });
    } else {
      player.on('ready', function(event) { callback(wrapper); });
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
    var timecode_onclick = function() { wrapper.seek(Number(this.dataset.value)); };
    timecodes.forEach(function(el) { el.onclick = timecode_onclick; });

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
