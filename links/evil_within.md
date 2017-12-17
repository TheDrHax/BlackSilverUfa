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

# The Evil Within

## 1 (прерван)

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [160844876](https://www.twitch.tv/videos/160844876) | [v160844876.ass](../chats/v160844876.ass) | Запись отсутствует |  |

<script>
  function openPlayer160844876() {
    createPlayer("player-NULL", "NULL", "160844876");
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
streamlink -p "mpv --sub-file chats/v160844876.ass" --player-passthrough hls twitch.tv/videos/160844876 best
```

----
## 1.5

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [160852861](https://www.twitch.tv/videos/160852861) | [v160852861.ass](../chats/v160852861.ass) | [LF6RMOOvA9M](https://www.youtube.com/watch?v=LF6RMOOvA9M) | <a href="/src/player.html?v=LF6RMOOvA9M&s=160852861" onclick="return openPlayer160852861()">▶</a> |

<script>
  function openPlayer160852861() {
    createPlayer("player-LF6RMOOvA9M", "LF6RMOOvA9M", "160852861");
    document.getElementById("spoiler-LF6RMOOvA9M").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-LF6RMOOvA9M"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-LF6RMOOvA9M"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v160852861.ass ytdl://LF6RMOOvA9M
```

----
## 2 (прерван)

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [161110508](https://www.twitch.tv/videos/161110508) | [v161110508.ass](../chats/v161110508.ass) | [8VCQkjjMu-I](https://www.youtube.com/watch?v=8VCQkjjMu-I) | <a href="/src/player.html?v=8VCQkjjMu-I&s=161110508" onclick="return openPlayer161110508()">▶</a> |

<script>
  function openPlayer161110508() {
    createPlayer("player-8VCQkjjMu-I", "8VCQkjjMu-I", "161110508");
    document.getElementById("spoiler-8VCQkjjMu-I").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-8VCQkjjMu-I"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-8VCQkjjMu-I"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v161110508.ass ytdl://8VCQkjjMu-I
```

----
## 2.5

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [161115703](https://www.twitch.tv/videos/161115703) | [v161115703.ass](../chats/v161115703.ass) | [vxbjz2-Lmgg](https://www.youtube.com/watch?v=vxbjz2-Lmgg) | <a href="/src/player.html?v=vxbjz2-Lmgg&s=161115703" onclick="return openPlayer161115703()">▶</a> |

<script>
  function openPlayer161115703() {
    createPlayer("player-vxbjz2-Lmgg", "vxbjz2-Lmgg", "161115703");
    document.getElementById("spoiler-vxbjz2-Lmgg").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-vxbjz2-Lmgg"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-vxbjz2-Lmgg"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v161115703.ass ytdl://vxbjz2-Lmgg
```

----
## 3

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [162350334](https://www.twitch.tv/videos/162350334) | [v162350334.ass](../chats/v162350334.ass) | [hZSVfTxT7Qo](https://www.youtube.com/watch?v=hZSVfTxT7Qo) | <a href="/src/player.html?v=hZSVfTxT7Qo&s=162350334" onclick="return openPlayer162350334()">▶</a> |

<script>
  function openPlayer162350334() {
    createPlayer("player-hZSVfTxT7Qo", "hZSVfTxT7Qo", "162350334");
    document.getElementById("spoiler-hZSVfTxT7Qo").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-hZSVfTxT7Qo"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-hZSVfTxT7Qo"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v162350334.ass ytdl://hZSVfTxT7Qo
```

----
## 4 (прерван)

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [162844424](https://www.twitch.tv/videos/162844424) | [v162844424.ass](../chats/v162844424.ass) | [8lhCzaGLmK8](https://www.youtube.com/watch?v=8lhCzaGLmK8) | <a href="/src/player.html?v=8lhCzaGLmK8&s=162844424" onclick="return openPlayer162844424()">▶</a> |

<script>
  function openPlayer162844424() {
    createPlayer("player-8lhCzaGLmK8", "8lhCzaGLmK8", "162844424");
    document.getElementById("spoiler-8lhCzaGLmK8").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-8lhCzaGLmK8"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-8lhCzaGLmK8"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v162844424.ass ytdl://8lhCzaGLmK8
```

----
## 5

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [163361169](https://www.twitch.tv/videos/163361169) | [v163361169.ass](../chats/v163361169.ass) | [Qt1N7foBrUE](https://www.youtube.com/watch?v=Qt1N7foBrUE) | <a href="/src/player.html?v=Qt1N7foBrUE&s=163361169" onclick="return openPlayer163361169()">▶</a> |

<script>
  function openPlayer163361169() {
    createPlayer("player-Qt1N7foBrUE", "Qt1N7foBrUE", "163361169");
    document.getElementById("spoiler-Qt1N7foBrUE").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-Qt1N7foBrUE"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-Qt1N7foBrUE"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v163361169.ass ytdl://Qt1N7foBrUE
```

----
## 6 (прерван)

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [164116949](https://www.twitch.tv/videos/164116949) | [v164116949.ass](../chats/v164116949.ass) | [5JOCDsqrhOY](https://www.youtube.com/watch?v=5JOCDsqrhOY) | <a href="/src/player.html?v=5JOCDsqrhOY&s=164116949" onclick="return openPlayer164116949()">▶</a> |

<script>
  function openPlayer164116949() {
    createPlayer("player-5JOCDsqrhOY", "5JOCDsqrhOY", "164116949");
    document.getElementById("spoiler-5JOCDsqrhOY").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-5JOCDsqrhOY"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-5JOCDsqrhOY"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v164116949.ass ytdl://5JOCDsqrhOY
```

----
## 6.5

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [164165380](https://www.twitch.tv/videos/164165380) | [v164165380.ass](../chats/v164165380.ass) | [yH9DIXACVkA](https://www.youtube.com/watch?v=yH9DIXACVkA) | <a href="/src/player.html?v=yH9DIXACVkA&s=164165380" onclick="return openPlayer164165380()">▶</a> |

<script>
  function openPlayer164165380() {
    createPlayer("player-yH9DIXACVkA", "yH9DIXACVkA", "164165380");
    document.getElementById("spoiler-yH9DIXACVkA").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-yH9DIXACVkA"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-yH9DIXACVkA"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v164165380.ass ytdl://yH9DIXACVkA
```

----

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

