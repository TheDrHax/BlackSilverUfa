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

# Darkwood

## 1

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [172968603](https://www.twitch.tv/videos/172968603) | [v172968603.ass](../chats/v172968603.ass) | [fxwks5MC9Ns](https://www.youtube.com/watch?v=fxwks5MC9Ns) | <a href="/src/player.html?v=fxwks5MC9Ns&s=172968603" onclick="return openPlayer172968603()">▶</a> |

<script>
  function openPlayer172968603() {
    createPlayer("player-fxwks5MC9Ns", "fxwks5MC9Ns", "172968603");
    document.getElementById("spoiler-fxwks5MC9Ns").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-fxwks5MC9Ns"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-fxwks5MC9Ns"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v172968603.ass ytdl://fxwks5MC9Ns
```

----
## 2

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [176397641](https://www.twitch.tv/videos/176397641) | [v176397641.ass](../chats/v176397641.ass) | [yxlbqLonbKI](https://www.youtube.com/watch?v=yxlbqLonbKI) | <a href="/src/player.html?v=yxlbqLonbKI&s=176397641" onclick="return openPlayer176397641()">▶</a> |

<script>
  function openPlayer176397641() {
    createPlayer("player-yxlbqLonbKI", "yxlbqLonbKI", "176397641");
    document.getElementById("spoiler-yxlbqLonbKI").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-yxlbqLonbKI"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-yxlbqLonbKI"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v176397641.ass ytdl://yxlbqLonbKI
```

----
## 3

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [177634045](https://www.twitch.tv/videos/177634045) | [v177634045.ass](../chats/v177634045.ass) | [NR3Acyrhnp4](https://www.youtube.com/watch?v=NR3Acyrhnp4) | <a href="/src/player.html?v=NR3Acyrhnp4&s=177634045" onclick="return openPlayer177634045()">▶</a> |

<script>
  function openPlayer177634045() {
    createPlayer("player-NR3Acyrhnp4", "NR3Acyrhnp4", "177634045");
    document.getElementById("spoiler-NR3Acyrhnp4").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-NR3Acyrhnp4"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-NR3Acyrhnp4"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v177634045.ass ytdl://NR3Acyrhnp4
```

----
## 4

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [179635876](https://www.twitch.tv/videos/179635876) | [v179635876.ass](../chats/v179635876.ass) | [zxTKOfKANt8](https://www.youtube.com/watch?v=zxTKOfKANt8) | <a href="/src/player.html?v=zxTKOfKANt8&s=179635876" onclick="return openPlayer179635876()">▶</a> |

<script>
  function openPlayer179635876() {
    createPlayer("player-zxTKOfKANt8", "zxTKOfKANt8", "179635876");
    document.getElementById("spoiler-zxTKOfKANt8").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-zxTKOfKANt8"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-zxTKOfKANt8"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v179635876.ass ytdl://zxTKOfKANt8
```

----
## 5

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [179882105](https://www.twitch.tv/videos/179882105) | [v179882105.ass](../chats/v179882105.ass) | [r6fssOx-GCQ](https://www.youtube.com/watch?v=r6fssOx-GCQ) | <a href="/src/player.html?v=r6fssOx-GCQ&s=179882105" onclick="return openPlayer179882105()">▶</a> |

<script>
  function openPlayer179882105() {
    createPlayer("player-r6fssOx-GCQ", "r6fssOx-GCQ", "179882105");
    document.getElementById("spoiler-r6fssOx-GCQ").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-r6fssOx-GCQ"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-r6fssOx-GCQ"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v179882105.ass ytdl://r6fssOx-GCQ
```

----
## 6

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [201707253](https://www.twitch.tv/videos/201707253) | [v201707253.ass](../chats/v201707253.ass) | [quashvbtL-M](https://www.youtube.com/watch?v=quashvbtL-M) | <a href="/src/player.html?v=quashvbtL-M&s=201707253" onclick="return openPlayer201707253()">▶</a> |

<script>
  function openPlayer201707253() {
    createPlayer("player-quashvbtL-M", "quashvbtL-M", "201707253");
    document.getElementById("spoiler-quashvbtL-M").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-quashvbtL-M"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-quashvbtL-M"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v201707253.ass ytdl://quashvbtL-M
```

----
## 7

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [203147401](https://www.twitch.tv/videos/203147401) | [v203147401.ass](../chats/v203147401.ass) | [xSMy8oGoWnQ](https://www.youtube.com/watch?v=xSMy8oGoWnQ) | <a href="/src/player.html?v=xSMy8oGoWnQ&s=203147401" onclick="return openPlayer203147401()">▶</a> |

<script>
  function openPlayer203147401() {
    createPlayer("player-xSMy8oGoWnQ", "xSMy8oGoWnQ", "203147401");
    document.getElementById("spoiler-xSMy8oGoWnQ").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-xSMy8oGoWnQ"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-xSMy8oGoWnQ"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v203147401.ass ytdl://xSMy8oGoWnQ
```

----
## 8

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [204186576](https://www.twitch.tv/videos/204186576) | [v204186576.ass](../chats/v204186576.ass) | [kEzcaYOhHaQ](https://www.youtube.com/watch?v=kEzcaYOhHaQ) | <a href="/src/player.html?v=kEzcaYOhHaQ&s=204186576" onclick="return openPlayer204186576()">▶</a> |

<script>
  function openPlayer204186576() {
    createPlayer("player-kEzcaYOhHaQ", "kEzcaYOhHaQ", "204186576");
    document.getElementById("spoiler-kEzcaYOhHaQ").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-kEzcaYOhHaQ"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-kEzcaYOhHaQ"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v204186576.ass ytdl://kEzcaYOhHaQ
```

----
## 9

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [206091904](https://www.twitch.tv/videos/206091904) | [v206091904.ass](../chats/v206091904.ass) | [-amaLXxGG30](https://www.youtube.com/watch?v=-amaLXxGG30) | <a href="/src/player.html?v=-amaLXxGG30&s=206091904" onclick="return openPlayer206091904()">▶</a> |

<script>
  function openPlayer206091904() {
    createPlayer("player--amaLXxGG30", "-amaLXxGG30", "206091904");
    document.getElementById("spoiler--amaLXxGG30").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler--amaLXxGG30"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player--amaLXxGG30"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v206091904.ass ytdl://-amaLXxGG30
```

----
## 10

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [207478875](https://www.twitch.tv/videos/207478875) | [v207478875.ass](../chats/v207478875.ass) | [30i6tsz6xmw](https://www.youtube.com/watch?v=30i6tsz6xmw) | <a href="/src/player.html?v=30i6tsz6xmw&s=207478875" onclick="return openPlayer207478875()">▶</a> |

<script>
  function openPlayer207478875() {
    createPlayer("player-30i6tsz6xmw", "30i6tsz6xmw", "207478875");
    document.getElementById("spoiler-30i6tsz6xmw").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-30i6tsz6xmw"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-30i6tsz6xmw"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v207478875.ass ytdl://30i6tsz6xmw
```

----
## 11

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [210024030](https://www.twitch.tv/videos/210024030) | [v210024030.ass](../chats/v210024030.ass) | [FAjRM5KGsnw](https://www.youtube.com/watch?v=FAjRM5KGsnw) | <a href="/src/player.html?v=FAjRM5KGsnw&s=210024030" onclick="return openPlayer210024030()">▶</a> |

<script>
  function openPlayer210024030() {
    createPlayer("player-FAjRM5KGsnw", "FAjRM5KGsnw", "210024030");
    document.getElementById("spoiler-FAjRM5KGsnw").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-FAjRM5KGsnw"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-FAjRM5KGsnw"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v210024030.ass ytdl://FAjRM5KGsnw
```

----

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

