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

# Middle-earth: Shadow of War

## 1

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [181166703](https://www.twitch.tv/videos/181166703) | [v181166703.ass](../chats/v181166703.ass) | [ZlMQcv0a1Sc](https://www.youtube.com/watch?v=ZlMQcv0a1Sc) | <a href="/src/player.html?v=ZlMQcv0a1Sc&s=181166703" onclick="return openPlayer181166703()">▶</a> |

<script>
  function openPlayer181166703() {
    createPlayer("player-ZlMQcv0a1Sc", "ZlMQcv0a1Sc", "181166703");
    document.getElementById("spoiler-ZlMQcv0a1Sc").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-ZlMQcv0a1Sc"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-ZlMQcv0a1Sc"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v181166703.ass ytdl://ZlMQcv0a1Sc
```

----
## 2

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [181408745](https://www.twitch.tv/videos/181408745) | [v181408745.ass](../chats/v181408745.ass) | [VQNcHN56go4](https://www.youtube.com/watch?v=VQNcHN56go4) | <a href="/src/player.html?v=VQNcHN56go4&s=181408745" onclick="return openPlayer181408745()">▶</a> |

<script>
  function openPlayer181408745() {
    createPlayer("player-VQNcHN56go4", "VQNcHN56go4", "181408745");
    document.getElementById("spoiler-VQNcHN56go4").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-VQNcHN56go4"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-VQNcHN56go4"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v181408745.ass ytdl://VQNcHN56go4
```

----
## 3

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [181664458](https://www.twitch.tv/videos/181664458) | [v181664458.ass](../chats/v181664458.ass) | [_k7nFbZSYD0](https://www.youtube.com/watch?v=_k7nFbZSYD0) | <a href="/src/player.html?v=_k7nFbZSYD0&s=181664458" onclick="return openPlayer181664458()">▶</a> |

<script>
  function openPlayer181664458() {
    createPlayer("player-_k7nFbZSYD0", "_k7nFbZSYD0", "181664458");
    document.getElementById("spoiler-_k7nFbZSYD0").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-_k7nFbZSYD0"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-_k7nFbZSYD0"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v181664458.ass ytdl://_k7nFbZSYD0
```

----

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

