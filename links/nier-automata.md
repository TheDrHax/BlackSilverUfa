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

# NieR Automata

## 1.1

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [215612485](https://www.twitch.tv/videos/215612485) | [v215612485.ass](../chats/v215612485.ass) | [PSFYqx5cHvk](https://www.youtube.com/watch?v=PSFYqx5cHvk) | <a href="/src/player.html?v=PSFYqx5cHvk&s=215612485" onclick="return openPlayer215612485()">▶</a> |

<script>
  function openPlayer215612485() {
    createPlayer("player-PSFYqx5cHvk", "PSFYqx5cHvk", "215612485");
    document.getElementById("spoiler-PSFYqx5cHvk").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-PSFYqx5cHvk"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-PSFYqx5cHvk"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v215612485.ass ytdl://PSFYqx5cHvk
```

----
## 1.2

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [215625839](https://www.twitch.tv/videos/215625839) | [v215625839.ass](../chats/v215625839.ass) | [1KJ_lUDyyVU](https://www.youtube.com/watch?v=1KJ_lUDyyVU) | <a href="/src/player.html?v=1KJ_lUDyyVU&s=215625839" onclick="return openPlayer215625839()">▶</a> |

<script>
  function openPlayer215625839() {
    createPlayer("player-1KJ_lUDyyVU", "1KJ_lUDyyVU", "215625839");
    document.getElementById("spoiler-1KJ_lUDyyVU").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-1KJ_lUDyyVU"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-1KJ_lUDyyVU"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v215625839.ass ytdl://1KJ_lUDyyVU
```

----
## Сайдквесты 1

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [215959213](https://www.twitch.tv/videos/215959213) | [v215959213.ass](../chats/v215959213.ass) | [h2rTS3adq9w](https://www.youtube.com/watch?v=h2rTS3adq9w) | <a href="/src/player.html?v=h2rTS3adq9w&s=215959213" onclick="return openPlayer215959213()">▶</a> |

<script>
  function openPlayer215959213() {
    createPlayer("player-h2rTS3adq9w", "h2rTS3adq9w", "215959213");
    document.getElementById("spoiler-h2rTS3adq9w").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-h2rTS3adq9w"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-h2rTS3adq9w"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v215959213.ass ytdl://h2rTS3adq9w
```

----

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

