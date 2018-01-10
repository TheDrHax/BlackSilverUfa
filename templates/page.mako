<%def name="gen_stream(stream)">
${'##'} ${stream['name']}

% if stream.get('youtube') is not None:
| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [${stream['twitch']}](https://www.twitch.tv/videos/${stream['twitch']}) \
| [v${stream['twitch']}.ass](../chats/v${stream['twitch']}.ass) \
| [${stream['youtube']}](https://www.youtube.com/watch?v=${stream['youtube']}) \
| <a href="/src/player.html?v=${stream['youtube']}&s=${stream['twitch']}" onclick="return openPlayer${stream['twitch']}()">▶</a> |

<script>
  function openPlayer${stream['twitch']}() {
    createPlayer("player-${stream['youtube']}", "${stream['youtube']}", "${stream['twitch']}");
    document.getElementById("spoiler-${stream['youtube']}").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-${stream['youtube']}"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-${stream['youtube']}"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>
% else:
| Twitch | Субтитры | YouTube |
| ------ | -------- | ------- |
| [${stream['twitch']}](https://www.twitch.tv/videos/${stream['twitch']}) \
| [v${stream['twitch']}.ass](../chats/v${stream['twitch']}.ass) \
| Запись отсутствует |
% endif

${'####'} Команда для просмотра стрима в проигрывателе MPV

```
% if stream.get('youtube') is not None:
mpv --sub-file chats/v${stream['twitch']}.ass ytdl://${stream['youtube']}
% else:
streamlink -p "mpv --sub-file chats/v${stream['twitch']}.ass" --player-passthrough hls twitch.tv/videos/${stream['twitch']} best
% endif
```

----
</%def>

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

<script>
function createPlayer(id, youtube, twitch) {
  videojs(id, {
    controls: true,
    nativeControlsForTouch: false,
    width: 640,
    height: 360,
    fluid: true,
    plugins: {
      ass: {
        src: ["../chats/v" + twitch + ".ass"],
        delay: -0.1,
      },
      videoJsResolutionSwitcher: {
        default: 'high',
        dynamicLabel: true
      }
    },
    techOrder: ["youtube"],
    sources: [{
      "type": "video/youtube",
      "src": "https://www.youtube.com/watch?v=" + youtube
    }]
  });
}
</script>

<style>
  .main-content {
    padding: 2rem;
    max-width: 72rem;
  }
</style>

${'#'} ${game['name']}

% for stream in game['streams']:
${gen_stream(stream)}
% endfor

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше
