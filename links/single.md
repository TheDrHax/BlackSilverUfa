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

# Полные прохождения за один стрим

## Michigan: Report from Hell

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [152253862](https://www.twitch.tv/videos/152253862) | [v152253862.ass](../chats/v152253862.ass) | [cTvtS4jAQGk](https://www.youtube.com/watch?v=cTvtS4jAQGk) | <a href="/src/player.html?v=cTvtS4jAQGk&s=152253862" onclick="return openPlayer152253862()">▶</a> |

<script>
  function openPlayer152253862() {
    createPlayer("player-cTvtS4jAQGk", "cTvtS4jAQGk", "152253862");
    document.getElementById("spoiler-cTvtS4jAQGk").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-cTvtS4jAQGk"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-cTvtS4jAQGk"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v152253862.ass ytdl://cTvtS4jAQGk
```

----
## Absolver

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [174225353](https://www.twitch.tv/videos/174225353) | [v174225353.ass](../chats/v174225353.ass) | [ejp3UDoKx4k](https://www.youtube.com/watch?v=ejp3UDoKx4k) | <a href="/src/player.html?v=ejp3UDoKx4k&s=174225353" onclick="return openPlayer174225353()">▶</a> |

<script>
  function openPlayer174225353() {
    createPlayer("player-ejp3UDoKx4k", "ejp3UDoKx4k", "174225353");
    document.getElementById("spoiler-ejp3UDoKx4k").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-ejp3UDoKx4k"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-ejp3UDoKx4k"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v174225353.ass ytdl://ejp3UDoKx4k
```

----
## The Count Lucanor

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [184468298](https://www.twitch.tv/videos/184468298) | [v184468298.ass](../chats/v184468298.ass) | [9p23c9_BYaU](https://www.youtube.com/watch?v=9p23c9_BYaU) | <a href="/src/player.html?v=9p23c9_BYaU&s=184468298" onclick="return openPlayer184468298()">▶</a> |

<script>
  function openPlayer184468298() {
    createPlayer("player-9p23c9_BYaU", "9p23c9_BYaU", "184468298");
    document.getElementById("spoiler-9p23c9_BYaU").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-9p23c9_BYaU"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-9p23c9_BYaU"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v184468298.ass ytdl://9p23c9_BYaU
```

----
## Call of Duty: WWII

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [187291538](https://www.twitch.tv/videos/187291538) | [v187291538.ass](../chats/v187291538.ass) | [Bxj09aAOFaI](https://www.youtube.com/watch?v=Bxj09aAOFaI) | <a href="/src/player.html?v=Bxj09aAOFaI&s=187291538" onclick="return openPlayer187291538()">▶</a> |

<script>
  function openPlayer187291538() {
    createPlayer("player-Bxj09aAOFaI", "Bxj09aAOFaI", "187291538");
    document.getElementById("spoiler-Bxj09aAOFaI").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-Bxj09aAOFaI"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-Bxj09aAOFaI"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v187291538.ass ytdl://Bxj09aAOFaI
```

----
## Little Nightmares (DLC)

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [200401270](https://www.twitch.tv/videos/200401270) | [v200401270.ass](../chats/v200401270.ass) | [LSHpifkX69Y](https://www.youtube.com/watch?v=LSHpifkX69Y) | <a href="/src/player.html?v=LSHpifkX69Y&s=200401270" onclick="return openPlayer200401270()">▶</a> |

<script>
  function openPlayer200401270() {
    createPlayer("player-LSHpifkX69Y", "LSHpifkX69Y", "200401270");
    document.getElementById("spoiler-LSHpifkX69Y").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-LSHpifkX69Y"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-LSHpifkX69Y"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v200401270.ass ytdl://LSHpifkX69Y
```

----
## Hidden Agenda (2 раза)

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [202329656](https://www.twitch.tv/videos/202329656) | [v202329656.ass](../chats/v202329656.ass) | [9kSnxedrUjM](https://www.youtube.com/watch?v=9kSnxedrUjM) | <a href="/src/player.html?v=9kSnxedrUjM&s=202329656" onclick="return openPlayer202329656()">▶</a> |

<script>
  function openPlayer202329656() {
    createPlayer("player-9kSnxedrUjM", "9kSnxedrUjM", "202329656");
    document.getElementById("spoiler-9kSnxedrUjM").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-9kSnxedrUjM"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-9kSnxedrUjM"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v202329656.ass ytdl://9kSnxedrUjM
```

----
## Unforgiving: A Northern Hymn

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [204996737](https://www.twitch.tv/videos/204996737) | [v204996737.ass](../chats/v204996737.ass) | [ZiYWnjvqw_k](https://www.youtube.com/watch?v=ZiYWnjvqw_k) | <a href="/src/player.html?v=ZiYWnjvqw_k&s=204996737" onclick="return openPlayer204996737()">▶</a> |

<script>
  function openPlayer204996737() {
    createPlayer("player-ZiYWnjvqw_k", "ZiYWnjvqw_k", "204996737");
    document.getElementById("spoiler-ZiYWnjvqw_k").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-ZiYWnjvqw_k"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-ZiYWnjvqw_k"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v204996737.ass ytdl://ZiYWnjvqw_k
```

----

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

