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

  var options = {};
  if (wrapper.dataset.end) {
    options.duration = (
      wrapper.dataset.offset ?
        sec(wrapper.dataset.end) - sec(wrapper.dataset.offset) :
        sec(wrapper.dataset.end)
    );
  }

  wrapper.innerHTML = '<video />';
  wrapper.style.marginTop = "32px";
  player = plyr.setup(wrapper, options)[0];

  player.on('timeupdate', function(event) {
    // Stop player when video exceeds overriden duration
    if (wrapper.dataset.end) {
      if (player.getCurrentTime() >= player.getDuration()) {
        player.seek(player.getDuration());
        player.pause();
      }
    }

    if (wrapper.dataset.start) {
      var start = (wrapper.dataset.offset ?
          sec(wrapper.dataset.start) - sec(wrapper.dataset.offset) :
          sec(wrapper.dataset.start));

      if (player.getCurrentTime() != 0 && player.getCurrentTime() < start) {
        player.seek(start);
      }

      // Seek to the start only one time
      if (player.getCurrentTime() != 0) {
        wrapper.dataset.start = false;
      }
    }
  });

  var source = { type: 'video' };
  if (wrapper.dataset.youtube) {
    source.sources = [{
      type: 'youtube',
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
  player.source(source);

  // Connect Subtitles Octopus to video
  var subtitles_options = {
    video: player.getMedia(),
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
    player.toggleCaptions(true);
  });

  if (wrapper.dataset.youtube) {
    // Fix Subtitles Octopus to work with embedded YouTube videos
    // TODO: Fix subtitles position in fullscreen mode
    function subResize(event) {
      var e_sub = subtitles.canvas;
      var e_vid = player.getMedia();

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
  } else if (wrapper.dataset.vk) {
    // Fix misplaced canvas (appears under the video before the start)
    subtitles.canvas.style.marginTop = '-150px';
    player.on('playing', function(event) {
      subtitles.canvas.style.marginTop = '0px';
      subtitles.resize();
    });
  }

  // Element controls
  wrapper.seek = function(t) {
    player.seek(t);
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
