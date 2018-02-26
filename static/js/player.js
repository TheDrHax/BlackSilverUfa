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
  var result = 0;
  var segments = timecode.split(':');
  for (var i = segments.length - 1; i >= 0; i--) {
    result += Number(segments[i]) * 60**(segments.length - 1 - i);
  }
  return result;
};

var players = {};
var subs = {};

function spawnPlayer(id, stream) {
  var player, subtitles;

  document.getElementById("button-" + id).style.display = 'none';
  var wrapper = document.getElementById('player-wrapper-' + id);
  wrapper.innerHTML = '<video id="player-' + id + '"></video>';
  wrapper.style.display = 'block';

  var options = {};
  if (stream.end) {
    options.duration = sec(stream.end);
  }
  player = plyr.setup('#player-' + id, options)[0];

  if (stream.end) {
    // Stop player when video exceeds overriden duration
    player.on('timeupdate', function(event) {
      if (player.getCurrentTime() >= player.getDuration()) {
        player.seek(player.getDuration());
        player.pause();
      }
    });
  }

  var source = { type: 'video' };
  if (stream.youtube) {
    source.sources = [{
      type: 'youtube',
      src: stream.youtube
    }];
  } else if (stream.vk) {
    source.sources = [{
      type: 'video/mp4',
      src: 'https://api.thedrhax.pw/vk/video/' + stream.vk + '\?redirect'
    }];
  } else {
    source.sources = [{
      type: 'video/mp4',
      src: stream.direct
    }];
  }
  player.source(source);

  if (stream.start) {
    // Seek to specific position on first start of the video
    player.on('ready', function(event) {
      player.seek(sec(stream.start));
    });
  }

  // Connect Subtitles Octopus to video
  var subtitles_options = {
    video: player.getMedia(),
    subUrl: "/chats/v" + stream.twitch + ".ass",
    workerUrl: '/static/js/subtitles-octopus-worker.js',
  };
  if (stream.subtitle_offset) {
    subtitles_options.timeOffset = sec(stream.subtitle_offset);
  }
  subtitles = new SubtitlesOctopus(subtitles_options);

  // Fix subtitles position on first start of the video
  player.on('play', function(event) {
    subtitles.resize();
  });

  if (stream.youtube) {
    // Fix Subtitles Octopus to work with embedded YouTube videos
    // TODO: Fix subtitles position in fullscreen mode
    function subResize(event) {
      var e_sub = subtitles.canvas;
      var e_vid = player.getMedia();

      e_sub.style.display = "block";
      e_sub.style.top = 0;
      e_sub.style.position = "absolute";
      e_sub.style.pointerEvents = "none";

      e_sub.width = e_vid.clientWidth;
      e_sub.height = e_vid.clientHeight;

      subtitles.resize(e_sub.width, e_sub.height);
    }

    player.on('ready', subResize);
    player.on('enterfullscreen', subResize);
    player.on('exitfullscreen', subResize);
    window.addEventListener('resize', debounce(subResize, 100, false));
  }

  players[id] = player;
  subs[id] = subtitles;

  return false;
};
