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

# Prey

## 1

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [140288888](https://www.twitch.tv/videos/140288888) | [v140288888.ass](../chats/v140288888.ass) | [Og2_fkJo8NY](https://www.youtube.com/watch?v=Og2_fkJo8NY) | <a href="/src/player.html?v=Og2_fkJo8NY&s=140288888" onclick="return openPlayer140288888()">▶</a> |

<script>
  function openPlayer140288888() {
    createPlayer("player-Og2_fkJo8NY", "Og2_fkJo8NY", "140288888");
    document.getElementById("spoiler-Og2_fkJo8NY").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-Og2_fkJo8NY"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-Og2_fkJo8NY"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v140288888.ass ytdl://Og2_fkJo8NY
```

----
## 2

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [140295699](https://www.twitch.tv/videos/140295699) | [v140295699.ass](../chats/v140295699.ass) | [x8lucgXcyfk](https://www.youtube.com/watch?v=x8lucgXcyfk) | <a href="/src/player.html?v=x8lucgXcyfk&s=140295699" onclick="return openPlayer140295699()">▶</a> |

<script>
  function openPlayer140295699() {
    createPlayer("player-x8lucgXcyfk", "x8lucgXcyfk", "140295699");
    document.getElementById("spoiler-x8lucgXcyfk").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-x8lucgXcyfk"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-x8lucgXcyfk"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v140295699.ass ytdl://x8lucgXcyfk
```

----
## 3

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [140548655](https://www.twitch.tv/videos/140548655) | [v140548655.ass](../chats/v140548655.ass) | [vbAftlMvoB8](https://www.youtube.com/watch?v=vbAftlMvoB8) | <a href="/src/player.html?v=vbAftlMvoB8&s=140548655" onclick="return openPlayer140548655()">▶</a> |

<script>
  function openPlayer140548655() {
    createPlayer("player-vbAftlMvoB8", "vbAftlMvoB8", "140548655");
    document.getElementById("spoiler-vbAftlMvoB8").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-vbAftlMvoB8"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-vbAftlMvoB8"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v140548655.ass ytdl://vbAftlMvoB8
```

----
## 4

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [141300323](https://www.twitch.tv/videos/141300323) | [v141300323.ass](../chats/v141300323.ass) | [u2jhKbGE7jY](https://www.youtube.com/watch?v=u2jhKbGE7jY) | <a href="/src/player.html?v=u2jhKbGE7jY&s=141300323" onclick="return openPlayer141300323()">▶</a> |

<script>
  function openPlayer141300323() {
    createPlayer("player-u2jhKbGE7jY", "u2jhKbGE7jY", "141300323");
    document.getElementById("spoiler-u2jhKbGE7jY").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-u2jhKbGE7jY"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-u2jhKbGE7jY"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v141300323.ass ytdl://u2jhKbGE7jY
```

----
## 5

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [141516144](https://www.twitch.tv/videos/141516144) | [v141516144.ass](../chats/v141516144.ass) | [qL_kIUCWWIY](https://www.youtube.com/watch?v=qL_kIUCWWIY) | <a href="/src/player.html?v=qL_kIUCWWIY&s=141516144" onclick="return openPlayer141516144()">▶</a> |

<script>
  function openPlayer141516144() {
    createPlayer("player-qL_kIUCWWIY", "qL_kIUCWWIY", "141516144");
    document.getElementById("spoiler-qL_kIUCWWIY").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-qL_kIUCWWIY"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-qL_kIUCWWIY"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v141516144.ass ytdl://qL_kIUCWWIY
```

----
## 6

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [142839507](https://www.twitch.tv/videos/142839507) | [v142839507.ass](../chats/v142839507.ass) | [xvSuZzQ9CpM](https://www.youtube.com/watch?v=xvSuZzQ9CpM) | <a href="/src/player.html?v=xvSuZzQ9CpM&s=142839507" onclick="return openPlayer142839507()">▶</a> |

<script>
  function openPlayer142839507() {
    createPlayer("player-xvSuZzQ9CpM", "xvSuZzQ9CpM", "142839507");
    document.getElementById("spoiler-xvSuZzQ9CpM").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-xvSuZzQ9CpM"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-xvSuZzQ9CpM"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v142839507.ass ytdl://xvSuZzQ9CpM
```

----

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

