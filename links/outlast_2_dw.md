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

# Outlast 2 (с Дашей)

## 1

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [174697007](https://www.twitch.tv/videos/174697007) | [v174697007.ass](../chats/v174697007.ass) | [-5aRKoYTGLs](https://www.youtube.com/watch?v=-5aRKoYTGLs) | <a href="/src/player.html?v=-5aRKoYTGLs&s=174697007" onclick="return openPlayer174697007()">▶</a> |

<script>
  function openPlayer174697007() {
    createPlayer("player--5aRKoYTGLs", "-5aRKoYTGLs", "174697007");
    document.getElementById("spoiler--5aRKoYTGLs").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler--5aRKoYTGLs"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player--5aRKoYTGLs"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v174697007.ass ytdl://-5aRKoYTGLs
```

----
## 2

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [186799946](https://www.twitch.tv/videos/186799946) | [v186799946.ass](../chats/v186799946.ass) | Запись отсутствует |  |

<script>
  function openPlayer186799946() {
    createPlayer("player-NULL", "NULL", "186799946");
    document.getElementById("spoiler-NULL").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-NULL"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-NULL"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
streamlink -p "mpv --sub-file chats/v186799946.ass" --player-passthrough hls twitch.tv/videos/186799946 best
```

----

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

