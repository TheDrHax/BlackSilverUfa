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

# Resident Evil 4

## 1

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [164633577](https://www.twitch.tv/videos/164633577) | [v164633577.ass](../chats/v164633577.ass) | [0XeyDh7T0Jw](https://www.youtube.com/watch?v=0XeyDh7T0Jw) | <a href="/src/player.html?v=0XeyDh7T0Jw&s=164633577" onclick="return openPlayer164633577()">▶</a> |

<script>
  function openPlayer164633577() {
    createPlayer("player-0XeyDh7T0Jw", "0XeyDh7T0Jw", "164633577");
    document.getElementById("spoiler-0XeyDh7T0Jw").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-0XeyDh7T0Jw"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-0XeyDh7T0Jw"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v164633577.ass ytdl://0XeyDh7T0Jw
```

----
## 2 (с 2:30:15)

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [165630859](https://www.twitch.tv/videos/165630859) | [v165630859.ass](../chats/v165630859.ass) | [7r6_dwXVXgE](https://www.youtube.com/watch?v=7r6_dwXVXgE) | <a href="/src/player.html?v=7r6_dwXVXgE&s=165630859" onclick="return openPlayer165630859()">▶</a> |

<script>
  function openPlayer165630859() {
    createPlayer("player-7r6_dwXVXgE", "7r6_dwXVXgE", "165630859");
    document.getElementById("spoiler-7r6_dwXVXgE").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-7r6_dwXVXgE"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-7r6_dwXVXgE"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v165630859.ass ytdl://7r6_dwXVXgE
```

----
## 3

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [167924021](https://www.twitch.tv/videos/167924021) | [v167924021.ass](../chats/v167924021.ass) | [9i6wUrnvLy8](https://www.youtube.com/watch?v=9i6wUrnvLy8) | <a href="/src/player.html?v=9i6wUrnvLy8&s=167924021" onclick="return openPlayer167924021()">▶</a> |

<script>
  function openPlayer167924021() {
    createPlayer("player-9i6wUrnvLy8", "9i6wUrnvLy8", "167924021");
    document.getElementById("spoiler-9i6wUrnvLy8").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-9i6wUrnvLy8"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-9i6wUrnvLy8"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v167924021.ass ytdl://9i6wUrnvLy8
```

----
## 4

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [168936842](https://www.twitch.tv/videos/168936842) | [v168936842.ass](../chats/v168936842.ass) | Запись отсутствует |  |

<script>
  function openPlayer168936842() {
    createPlayer("player-NULL", "NULL", "168936842");
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
streamlink -p "mpv --sub-file chats/v168936842.ass" --player-passthrough hls twitch.tv/videos/168936842 best
```

----
## 5

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
## 6 (финал за Леона)

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

