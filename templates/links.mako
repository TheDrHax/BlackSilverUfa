<%inherit file="base.mako" />
<%namespace file="markdown.mako" name="md" />

<%block name="content">
<%
  def sec(t):
    return sum(int(x) * 60 ** i for i,x in enumerate(reversed(t.split(":"))))

  def mpv_compatible(stream):
    for i in ['youtube', 'vk', 'direct', 'segments']:
       if i in stream:
           return True
    return False

  def mpv_args(stream):
    if stream.get('youtube'):
      return 'ytdl://' + stream['youtube']
    elif stream.get('vk'):
      return 'https://api.thedrhax.pw/vk/video/' + stream['vk'] + '\?redirect'
    elif stream.get('direct'):
      return stream['direct']
    elif stream.get('segments'):
      segments = [mpv_args(segment) for segment in stream['segments']]
      return '--merge-files ' + ' '.join(segments)
%>

<%def name="timecode_link(id, timecode)"> \
<a onclick="player${id}.currentTime(${sec(timecode)})">${timecode}</a> \
</%def>

<%def name="source_link(stream, text=u'Запись')">\
% if stream.get('youtube'):
  <li>${text} (YouTube): <a href="https://www.youtube.com/watch?v=${stream['youtube']}">${stream['youtube']}</a></li>
% elif stream.get('vk'):
  <li>${text} (ВКонтакте): <a href="https://vk.com/video${stream['vk']}">${stream['vk']}</a></li>
% elif stream.get('direct'):
  <li>${text}: <a href="${stream['direct']}">прямая ссылка</a></li>
% elif stream.get('segments'):
  <li>Запись сегментирована:</li>
  <ul>
  % for segment in stream['segments']:
    ${source_link(segment, text=u'Часть {}'.format(stream['segments'].index(segment)+1))}
  % endfor
  </ul>
% else:
  <li>${text}: отсутствует</li>
% endif
</%def>

<%def name="player(id, stream, text=u'Открыть плеер')">
<p>
  <a onclick="return openPlayer${id}()" id="button-${id}">
    <b>▶ ${text}</b>
  </a>
</p>

<script>
  var player${id};
  function openPlayer${id}() {
    player${id} = videojs("player-${id}", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v${stream['twitch']}.ass"],
          % if stream.get('subtitle_offset'):
          delay: ${- sec(stream['subtitle_offset']) - 0.1},
          % else:
          delay: -0.1,
          % endif
        },
        % if stream.get('youtube'):
        videoJsResolutionSwitcher: {
          default: 'high',
          dynamicLabel: true
        }
        % endif
      },
      % if stream.get('youtube'):
      techOrder: ["youtube"],
      sources: [{
        "type": "video/youtube",
        "src": "https://www.youtube.com/watch?v=${stream['youtube']}"
      }]
      % elif stream.get('vk'):
      sources: [{
        "type": "video/mp4",
        "src": "https://api.thedrhax.pw/vk/video/${stream['vk']}?redirect"
      }]
      % elif stream.get('direct'):
      sources: [{
        "type": "video/mp4",
        "src": "${stream['direct']}"
      }]
      % endif
    });
    document.getElementById("spoiler-${id}").click();
    document.getElementById("button-${id}").remove();
    % if stream.get('start'):
      player${id}.currentTime(${sec(stream['start'])});
    % endif
    % if stream.get('end'):
      player${id}.duration = function() {
        return ${sec(stream['end'])}; // the amount of seconds of video
      }
      player${id}.remainingTimeDisplay = function() {
        var a = Math.floor(this.duration()) - Math.floor(this.currentTime());
        if (a <= 0) this.pause();
        return a;
      }
    % endif
    return false;
  }
</script>

<details>
  <summary id="spoiler-${id}"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-${id}" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
if (window.location.hash) {
  var id = window.location.hash.replace('#', '');
  if (id == "${id}" || id == "${stream['twitch']}")
    openPlayer${id}();
}
</script>
</%def>

<%def name="gen_stream(id, stream)">
<h2 id="${stream['twitch']}">
  <a id="${id}" href="#${stream['twitch']}">${stream['name']}</a>
</h2>

<ul>
% if stream.get('note'):
  <li>Примечание: ${stream['note']}</li>
% endif
  <li>Ссылки:</li>
  <ul>
    <li>Twitch: <a href="https://www.twitch.tv/videos/${stream['twitch']}">${stream['twitch']}</a></li>
    <li>Субтитры: <a href="../chats/v${stream['twitch']}.ass">v${stream['twitch']}.ass</a></li>
    ${source_link(stream)}
  </ul>
% if stream.get('timecodes'):
% if stream.get('segments'):
  <li>Таймкоды (работают только в пределах первой части, см. <a href="https://github.com/TheDrHax/BlackSilverUfa/issues/5">#5</a>)</li>
% else:
  <li>Таймкоды:</li>
% endif
  <ul>
  % for timecode in stream['timecodes']:
    <li>${timecode_link(id, timecode[0])} - ${timecode[1]}</li>
  % endfor
  </ul>
% endif
% if stream.get('start'):
  <li>Стрим начинается с ${timecode_link(id, stream['start'])}</li>
% endif
% if stream.get('end'):
  <li>Стрим заканчивается в ${timecode_link(id, stream['end'])}</li>
% endif
</ul>

% if stream.get('youtube') or stream.get('direct') or stream.get('vk'):
${player(id, stream)}
% elif stream.get('segments'):
% for segment in stream['segments']:
<%
  segment_index = stream['segments'].index(segment)
  segment_id = 100*(id+1) + segment_index
  segment['twitch'] = stream['twitch']
%> \
${player(segment_id, segment, text=u'Часть {}'.format(segment_index+1))}
% endfor
% endif

<h4>Команда для просмотра стрима в проигрывателе MPV</h4>

<%md:code_block>\
% if mpv_compatible(stream):
mpv --sub-file chats/v${stream['twitch']}.ass ${mpv_args(stream)}
% else:
streamlink -p "mpv --sub-file chats/v${stream['twitch']}.ass" --player-passthrough hls twitch.tv/videos/${stream['twitch']} best
% endif
</%md:code_block>

<hr>
</%def>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<!-- video.js -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/6.3.3/video-js.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/6.3.3/video.js"></script>
<!-- videojs-youtube -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-youtube/2.4.1/Youtube.js"></script>
<!-- libjass -->
<link href="https://cdn.jsdelivr.net/npm/libjass@0.11.0/libjass.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/libjass@0.11.0/libjass.js"></script>
<!-- videojs-ass -->
<link href="https://cdn.jsdelivr.net/npm/videojs-ass@0.8.0/src/videojs.ass.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/videojs-ass@0.8.0/src/videojs.ass.js"></script>
<!-- videojs-resolution-switcher -->
<script src="https://cdn.jsdelivr.net/npm/videojs-resolution-switcher@0.4.2/lib/videojs-resolution-switcher.min.js"></script>

<style>
  .main-content {
    padding: 2rem;
    max-width: 72rem;
  }
</style>

<h1>${game['name']}</h1>
<% id = 0 %> \
% for stream in game['streams']:
${gen_stream(id, stream)}
<% id += 1 %> \
% endfor

<p>Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по <a href="../tutorials/watch-online.md">этой</a> инструкции.</p>

<p>Быстрый старт:</p>
<ul>
  <li><%md:code>git clone https://github.com/TheDrHax/BlackSilverUfa.git</%md:code></li>
  <li><%md:code>cd BlackSilverUfa</%md:code></li>
  <li><%md:code>git checkout gh-pages</%md:code></li>
  <li>Команда, приведённая выше</li>
</ul>
</%block>
