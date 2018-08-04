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

// Convert HH:MM:SS or MM:SS to seconds
function sec(timecode) {
  if (timecode === undefined) return 0;
  if (timecode[0] == '-') {
    return - sec(timecode.replace('-', ''));
  }
  var result = 0;
  var segments = timecode.split(':');
  for (var i = segments.length - 1; i >= 0; i--) {
    result += Number(segments[i]) * 60**(segments.length - 1 - i);
  }
  return result;
};

function spawnPlayer(wrapper, callback) {
  if (wrapper.dataset.youtube || wrapper.dataset.vk || wrapper.dataset.direct) {
    return spawnPlyr(wrapper, callback);
  }
}

function spawnPlyr(wrapper, callback) {
  var player, subtitles;

  var stream = wrapper.dataset;

  var options = {
    // Disable quality seletion (doesn't work on YouTube)
    settings: ['captions', /* 'quality', */ 'speed', 'loop'],
    invertTime: false
  };
  if (wrapper.dataset.end) {
    options.duration = sec(wrapper.dataset.end) - sec(wrapper.dataset.offset);
  }

  wrapper.innerHTML = '<video />';
  wrapper.style.marginTop = "32px";
  player = new Plyr(wrapper.children[0], options);

  player.on('timeupdate', function(event) {
    // Stop player when video exceeds overriden duration
    if (wrapper.dataset.end) {
      if (player.currentTime >= player.config.duration) {
        player.currentTime = player.config.duration;
        player.pause();
      }
    }

    if (wrapper.dataset.start) {
      var start = sec(wrapper.dataset.start) - sec(wrapper.dataset.offset);

      if (player.currentTime != NaN && player.currentTime < start) {
        player.currentTime = start;
        wrapper.dataset.start = false; // Seek to the start only one time
      }
    }
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
  } else if (wrapper.dataset.vk) {
    source.sources = [{
      type: 'video/mp4',
      src: 'https://api.thedrhax.pw/vk/video/' + wrapper.dataset.vk + '.mp4'
    }];
    source.poster = 'https://api.thedrhax.pw/vk/video/' + wrapper.dataset.vk + '.jpg';
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
    subUrl: "/chats/v" + wrapper.dataset.twitch + ".ass",
    workerUrl: '/static/js/subtitles-octopus-worker.js',
  };
  if (wrapper.dataset.offset) {
    subtitles_options.timeOffset = sec(wrapper.dataset.offset);
  }
  subtitles = new SubtitlesOctopus(subtitles_options);

  // Player caption button
  player.on('captionsenabled', function(event) {
    subtitles.canvas.style.display = 'block';
  });
  player.on('captionsdisabled', function(event) {
    subtitles.canvas.style.display = 'none';
  });
  player.on('ready', function(event) {
    // Set correct player element to track current time
    subtitles.setVideo(player.media);

    // Force enable captions button
    // Also check '.plyr [data-plyr=captions]' style in styles.css
    player.toggleCaptions(true);
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
  } else if (wrapper.dataset.vk) {
    // Fix misplaced canvas (appears under the video before the start)
    subtitles.canvas.style.marginTop = '-150px';
    player.on('playing', function(event) {
      subtitles.canvas.style.marginTop = '0px';
      subtitles.resize();
    });
  }

  // Element controls
  wrapper.seek = function(time) {
    player.currentTime = time;
    wrapper.dataset.start = false; // ignore 'start' attribute
    player.play();
    return false;
  };

  if (callback != undefined) {
    if (wrapper.dataset.vk) {
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
    window.location.replace('/src/player.html?s=' + hash.join('.'));
  }
}, false);
