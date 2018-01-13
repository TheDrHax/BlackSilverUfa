<%
  def sec(t):
    return sum(int(x) * 60 ** i for i,x in enumerate(reversed(t.split(":"))))
%>

<%def name="timecode_link(id, timecode)"> \
<a onclick="player${id}.currentTime(${sec(timecode)})">${timecode}</a> \
</%def>

<%def name="player(id, stream)">
<a onclick="return openPlayer${id}()" id="button-${id}">**▶ Открыть плеер**</a>

<script>
  var player${id};
  function openPlayer${id}() {
    player${id} = videojs("player-${id}", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v${stream['twitch']}.ass"],
          delay: -0.1,
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
      % elif stream.get('direct'):
      sources: [{
        "type": "video/mp4",
        "src": "${stream['direct']}"
      }]
      % endif
    });
    document.getElementById("spoiler-${id}").click();
    document.getElementById("button-${id}").remove();
    % if stream.get('vk'):
      $.getJSON("https://api.thedrhax.pw/vk/video/${stream['vk']}", function(data) {
          console.log("Ссылка получена: " + data.url);
          player${id}.src([{type: 'video/mp4', src: data.url}]);
      });
    % endif
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
</details> \
</%def>

<%def name="gen_stream(id, stream)">
${'##'} ${stream['name']}

% if stream.get('note'):
* Примечание: ${stream['note']}
% endif
* Ссылки:
  * Twitch: [${stream['twitch']}](https://www.twitch.tv/videos/${stream['twitch']})
  * Субтитры: [v${stream['twitch']}.ass](../chats/v${stream['twitch']}.ass)
% if stream.get('youtube'):
  * Запись (YouTube): [${stream['youtube']}](https://www.youtube.com/watch?v=${stream['youtube']})
% elif stream.get('vk'):
  * Запись (ВКонтакте): [${stream['vk']}](https://vk.com/video${stream['vk']})
% elif stream.get('direct'):
  * Запись: [прямая ссылка](${stream['direct']})
% else:
  * Запись: отсутствует
% endif
% if stream.get('timecodes'):
* Таймкоды:
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
% if stream.get('vk'):
Примечание: Для этого стрима используется экспериментальный сервер, стабильность
которого уступает GitHub Pages. Если видео не запускается, сообщите мне через
раздел [Issues](https://github.com/TheDrHax/BlackSilverUfa/issues). Спасибо!
% endif
% endif

${'####'} Команда для просмотра стрима в проигрывателе MPV

```
% if stream.get('youtube'):
mpv --sub-file chats/v${stream['twitch']}.ass ytdl://${stream['youtube']}
% elif stream.get('direct'):
mpv --sub-file chats/v${stream['twitch']}.ass ${stream['direct']}
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
