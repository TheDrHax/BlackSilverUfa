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

# Black Mirror

## 1

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [205262158](https://www.twitch.tv/videos/205262158) | [v205262158.ass](../chats/v205262158.ass) | [9rrv07l9Bxs](https://www.youtube.com/watch?v=9rrv07l9Bxs) | <a href="/src/player.html?v=9rrv07l9Bxs&s=205262158" onclick="return openPlayer205262158()">▶</a> |

<script>
  function openPlayer205262158() {
    createPlayer("player-9rrv07l9Bxs", "9rrv07l9Bxs", "205262158");
    document.getElementById("spoiler-9rrv07l9Bxs").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-9rrv07l9Bxs"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-9rrv07l9Bxs"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v205262158.ass ytdl://9rrv07l9Bxs
```

----
## 2 (с 3:07:00)

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

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

