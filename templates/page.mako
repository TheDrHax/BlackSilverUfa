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

<%def name="source_link(stream, text=u'Запись')"> \
% if stream.get('youtube'):
  * ${text} (YouTube): [${stream['youtube']}](https://www.youtube.com/watch?v=${stream['youtube']}) \
% elif stream.get('vk'):
  * ${text} (ВКонтакте): [${stream['vk']}](https://vk.com/video${stream['vk']}) \
% elif stream.get('direct'):
  * ${text}: [прямая ссылка](${stream['direct']}) \
% elif stream.get('segments'):
  * Запись сегментирована:
  % for segment in stream['segments']:
    ${source_link(segment, text=u'Часть {}'.format(stream['segments'].index(segment)+1))}
  % endfor
% else:
  * ${text}: отсутствует \
% endif
</%def>

<%def name="player(id, stream, text=u'Открыть плеер')">
<a onclick="return openPlayer${id}()" id="button-${id}">**▶ ${text}**</a>

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
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '${id}')
      openPlayer${id}();
</script> \
</%def>

<%def name="gen_stream(id, stream)">
<h2 id="${id}"><a href="#${id}">${stream['name']}</a></h2>

% if stream.get('note'):
* Примечание: ${stream['note']}
% endif
* Ссылки:
  * Twitch: [${stream['twitch']}](https://www.twitch.tv/videos/${stream['twitch']})
  * Субтитры: [v${stream['twitch']}.ass](../chats/v${stream['twitch']}.ass)
${source_link(stream)}
% if stream.get('timecodes'):
% if stream.get('segments'):
* Таймкоды (работают только в пределах первой части, см. [#5](https://github.com/TheDrHax/BlackSilverUfa/issues/5))
% else:
* Таймкоды:
% endif
  % for timecode in stream['timecodes']:
  * ${timecode_link(id, timecode[0])} - ${timecode[1]}
  % endfor
% endif
% if stream.get('start'):
* Стрим начинается с ${timecode_link(id, stream['start'])}
% endif
% if stream.get('end'):
* Стрим заканчивается в ${timecode_link(id, stream['end'])}
% endif

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

${'####'} Команда для просмотра стрима в проигрывателе MPV

```
% if mpv_compatible(stream):
mpv --sub-file chats/v${stream['twitch']}.ass ${mpv_args(stream)}
% else:
streamlink -p "mpv --sub-file chats/v${stream['twitch']}.ass" --player-passthrough hls twitch.tv/videos/${stream['twitch']} best
% endif
```

---- \
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

${'#'} ${game['name']}
<% id = 0 %> \
% for stream in game['streams']:
${gen_stream(id, stream)}
<% id += 1 %> \
% endfor

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше
