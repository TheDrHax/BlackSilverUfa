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

# Super Mario Odyssey

## 1

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [185763905](https://www.twitch.tv/videos/185763905) | [v185763905.ass](../chats/v185763905.ass) | [kkeGLQrrkAM](https://www.youtube.com/watch?v=kkeGLQrrkAM) | <a href="/src/player.html?v=kkeGLQrrkAM&s=185763905" onclick="return openPlayer185763905()">▶</a> |

<script>
  function openPlayer185763905() {
    createPlayer("player-kkeGLQrrkAM", "kkeGLQrrkAM", "185763905");
    document.getElementById("spoiler-kkeGLQrrkAM").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-kkeGLQrrkAM"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-kkeGLQrrkAM"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v185763905.ass ytdl://kkeGLQrrkAM
```

----
## 2 (с 3:10:20)

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [200401270](https://www.twitch.tv/videos/200401270) | [v200401270.ass](../chats/v200401270.ass) | [LSHpifkX69Y](https://www.youtube.com/watch?v=LSHpifkX69Y) | <a href="/src/player.html?v=LSHpifkX69Y&s=200401270" onclick="return openPlayer200401270()">▶</a> |

<script>
  function openPlayer200401270() {
    createPlayer("player-LSHpifkX69Y", "LSHpifkX69Y", "200401270");
    document.getElementById("spoiler-LSHpifkX69Y").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-LSHpifkX69Y"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-LSHpifkX69Y"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v200401270.ass ytdl://LSHpifkX69Y
```

----
## 3

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [202381358](https://www.twitch.tv/videos/202381358) | [v202381358.ass](../chats/v202381358.ass) | [Umsq53kBb9I](https://www.youtube.com/watch?v=Umsq53kBb9I) | <a href="/src/player.html?v=Umsq53kBb9I&s=202381358" onclick="return openPlayer202381358()">▶</a> |

<script>
  function openPlayer202381358() {
    createPlayer("player-Umsq53kBb9I", "Umsq53kBb9I", "202381358");
    document.getElementById("spoiler-Umsq53kBb9I").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-Umsq53kBb9I"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-Umsq53kBb9I"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v202381358.ass ytdl://Umsq53kBb9I
```

----

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

