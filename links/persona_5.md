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

# Persona 5

## 1

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [135797319](https://www.twitch.tv/videos/135797319) | [v135797319.ass](../chats/v135797319.ass) | [-c8n0TR5-no](https://www.youtube.com/watch?v=-c8n0TR5-no) | <a href="/src/player.html?v=-c8n0TR5-no&s=135797319" onclick="return openPlayer135797319()">▶</a> |

<script>
  function openPlayer135797319() {
    createPlayer("player--c8n0TR5-no", "-c8n0TR5-no", "135797319");
    document.getElementById("spoiler--c8n0TR5-no").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler--c8n0TR5-no"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player--c8n0TR5-no"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v135797319.ass ytdl://-c8n0TR5-no
```

----
## 2

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [136865997](https://www.twitch.tv/videos/136865997) | [v136865997.ass](../chats/v136865997.ass) | [BlZNqMcZHzg](https://www.youtube.com/watch?v=BlZNqMcZHzg) | <a href="/src/player.html?v=BlZNqMcZHzg&s=136865997" onclick="return openPlayer136865997()">▶</a> |

<script>
  function openPlayer136865997() {
    createPlayer("player-BlZNqMcZHzg", "BlZNqMcZHzg", "136865997");
    document.getElementById("spoiler-BlZNqMcZHzg").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-BlZNqMcZHzg"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-BlZNqMcZHzg"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v136865997.ass ytdl://BlZNqMcZHzg
```

----
## 3

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [140054639](https://www.twitch.tv/videos/140054639) | [v140054639.ass](../chats/v140054639.ass) | [Cx2_Mlrx6dM](https://www.youtube.com/watch?v=Cx2_Mlrx6dM) | <a href="/src/player.html?v=Cx2_Mlrx6dM&s=140054639" onclick="return openPlayer140054639()">▶</a> |

<script>
  function openPlayer140054639() {
    createPlayer("player-Cx2_Mlrx6dM", "Cx2_Mlrx6dM", "140054639");
    document.getElementById("spoiler-Cx2_Mlrx6dM").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-Cx2_Mlrx6dM"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-Cx2_Mlrx6dM"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v140054639.ass ytdl://Cx2_Mlrx6dM
```

----
## 4

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [146618890](https://www.twitch.tv/videos/146618890) | [v146618890.ass](../chats/v146618890.ass) | [E8XS7RP8xGE](https://www.youtube.com/watch?v=E8XS7RP8xGE) | <a href="/src/player.html?v=E8XS7RP8xGE&s=146618890" onclick="return openPlayer146618890()">▶</a> |

<script>
  function openPlayer146618890() {
    createPlayer("player-E8XS7RP8xGE", "E8XS7RP8xGE", "146618890");
    document.getElementById("spoiler-E8XS7RP8xGE").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-E8XS7RP8xGE"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-E8XS7RP8xGE"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v146618890.ass ytdl://E8XS7RP8xGE
```

----
## 5

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [148253751](https://www.twitch.tv/videos/148253751) | [v148253751.ass](../chats/v148253751.ass) | [eMFwk3Enb3c](https://www.youtube.com/watch?v=eMFwk3Enb3c) | <a href="/src/player.html?v=eMFwk3Enb3c&s=148253751" onclick="return openPlayer148253751()">▶</a> |

<script>
  function openPlayer148253751() {
    createPlayer("player-eMFwk3Enb3c", "eMFwk3Enb3c", "148253751");
    document.getElementById("spoiler-eMFwk3Enb3c").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-eMFwk3Enb3c"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-eMFwk3Enb3c"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v148253751.ass ytdl://eMFwk3Enb3c
```

----
## 6 (с 2:15:00)

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [154787759](https://www.twitch.tv/videos/154787759) | [v154787759.ass](../chats/v154787759.ass) | [f5U_5Gwx-Mk](https://www.youtube.com/watch?v=f5U_5Gwx-Mk) | <a href="/src/player.html?v=f5U_5Gwx-Mk&s=154787759" onclick="return openPlayer154787759()">▶</a> |

<script>
  function openPlayer154787759() {
    createPlayer("player-f5U_5Gwx-Mk", "f5U_5Gwx-Mk", "154787759");
    document.getElementById("spoiler-f5U_5Gwx-Mk").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-f5U_5Gwx-Mk"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-f5U_5Gwx-Mk"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v154787759.ass ytdl://f5U_5Gwx-Mk
```

----
## 7 (с 2:10:30)

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [173993139](https://www.twitch.tv/videos/173993139) | [v173993139.ass](../chats/v173993139.ass) | [eGY5W8Dtehs](https://www.youtube.com/watch?v=eGY5W8Dtehs) | <a href="/src/player.html?v=eGY5W8Dtehs&s=173993139" onclick="return openPlayer173993139()">▶</a> |

<script>
  function openPlayer173993139() {
    createPlayer("player-eGY5W8Dtehs", "eGY5W8Dtehs", "173993139");
    document.getElementById("spoiler-eGY5W8Dtehs").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-eGY5W8Dtehs"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-eGY5W8Dtehs"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v173993139.ass ytdl://eGY5W8Dtehs
```

----
## 8 (с 2:10:04)

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [175695460](https://www.twitch.tv/videos/175695460) | [v175695460.ass](../chats/v175695460.ass) | [gJX8uR-GZcU](https://www.youtube.com/watch?v=gJX8uR-GZcU) | <a href="/src/player.html?v=gJX8uR-GZcU&s=175695460" onclick="return openPlayer175695460()">▶</a> |

<script>
  function openPlayer175695460() {
    createPlayer("player-gJX8uR-GZcU", "gJX8uR-GZcU", "175695460");
    document.getElementById("spoiler-gJX8uR-GZcU").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-gJX8uR-GZcU"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-gJX8uR-GZcU"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v175695460.ass ytdl://gJX8uR-GZcU
```

----

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

