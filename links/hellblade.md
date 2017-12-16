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

# Hellblade: Senua's Sacrifice

## 1

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [165359272](https://www.twitch.tv/videos/165359272) | [v165359272.ass](../chats/v165359272.ass) | [qInCMF9MuEs](https://www.youtube.com/watch?v=qInCMF9MuEs) | <a href="/src/player.html?v=qInCMF9MuEs&s=165359272" onclick="return openPlayer165359272()">▶</a> |

<script>
  function openPlayer165359272() {
    createPlayer("player-qInCMF9MuEs", "qInCMF9MuEs", "165359272");
    document.getElementById("spoiler-qInCMF9MuEs").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-qInCMF9MuEs"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-qInCMF9MuEs"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v165359272.ass ytdl://qInCMF9MuEs
```
----
## 2

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

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

