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

# Sub-Day и стримы с несколькими играми

## 17:26 - Road Redemption<br>1:16:16 - Battle Chasers<br>2:57:45 - Stardew Valley

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [180397849](https://www.twitch.tv/videos/180397849) | [v180397849.ass](../chats/v180397849.ass) | [x5KwWrLRpEg](https://www.youtube.com/watch?v=x5KwWrLRpEg) | <a href="/src/player.html?v=x5KwWrLRpEg&s=180397849" onclick="return openPlayer180397849()">▶</a> |

<script>
  function openPlayer180397849() {
    createPlayer("player-x5KwWrLRpEg", "x5KwWrLRpEg", "180397849");
    document.getElementById("spoiler-x5KwWrLRpEg").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-x5KwWrLRpEg"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-x5KwWrLRpEg"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v180397849.ass ytdl://x5KwWrLRpEg
```

----
## 20:47 - Uncanny Valley<br>1:44:54 - The Coma: Recut<br>2:52:00 - Lone Survivor

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [212431882](https://www.twitch.tv/videos/212431882) | [v212431882.ass](../chats/v212431882.ass) | [JS7cNXnzCTA](https://www.youtube.com/watch?v=JS7cNXnzCTA) | <a href="/src/player.html?v=JS7cNXnzCTA&s=212431882" onclick="return openPlayer212431882()">▶</a> |

<script>
  function openPlayer212431882() {
    createPlayer("player-JS7cNXnzCTA", "JS7cNXnzCTA", "212431882");
    document.getElementById("spoiler-JS7cNXnzCTA").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-JS7cNXnzCTA"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-JS7cNXnzCTA"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v212431882.ass ytdl://JS7cNXnzCTA
```

----

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

