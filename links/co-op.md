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

# Несюжетные ко-опы

## 11:12 - Hand Simulator<br>1:35:44 - Ben and Ed: Blood Party<br>3:19:30 - Stick Fight<br>4:02:04 - Golf It!

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [180663832](https://www.twitch.tv/videos/180663832) | [v180663832.ass](../chats/v180663832.ass) | [y2PitYePsOU](https://www.youtube.com/watch?v=y2PitYePsOU) | <a href="/src/player.html?v=y2PitYePsOU&s=180663832" onclick="return openPlayer180663832()">▶</a> |

<script>
  function openPlayer180663832() {
    createPlayer("player-y2PitYePsOU", "y2PitYePsOU", "180663832");
    document.getElementById("spoiler-y2PitYePsOU").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-y2PitYePsOU"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-y2PitYePsOU"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v180663832.ass ytdl://y2PitYePsOU
```

----
## 15:16 - Hand Simulator<br>1:12:26 - Gang Beasts<br>2:18:21 - Duck Game<br>2:46:00 - Move or Die

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [182448131](https://www.twitch.tv/videos/182448131) | [v182448131.ass](../chats/v182448131.ass) | [IqTeWjugKOE](https://www.youtube.com/watch?v=IqTeWjugKOE) | <a href="/src/player.html?v=IqTeWjugKOE&s=182448131" onclick="return openPlayer182448131()">▶</a> |

<script>
  function openPlayer182448131() {
    createPlayer("player-IqTeWjugKOE", "IqTeWjugKOE", "182448131");
    document.getElementById("spoiler-IqTeWjugKOE").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-IqTeWjugKOE"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-IqTeWjugKOE"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v182448131.ass ytdl://IqTeWjugKOE
```

----
## 24:55 - Spelunker! Party<br>54:58 - Ultimate Chicken Horse<br>1:48:56 - We Need to go Deeper<br>2:55:35 - Gang Beasts<br>3:49:00 - Hand Simulator<br>4:18:30 - Golf It!

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [184206477](https://www.twitch.tv/videos/184206477) | [v184206477.ass](../chats/v184206477.ass) | [tUc-5QNu_CE](https://www.youtube.com/watch?v=tUc-5QNu_CE) | <a href="/src/player.html?v=tUc-5QNu_CE&s=184206477" onclick="return openPlayer184206477()">▶</a> |

<script>
  function openPlayer184206477() {
    createPlayer("player-tUc-5QNu_CE", "tUc-5QNu_CE", "184206477");
    document.getElementById("spoiler-tUc-5QNu_CE").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-tUc-5QNu_CE"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-tUc-5QNu_CE"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v184206477.ass ytdl://tUc-5QNu_CE
```

----
## 25:22 - Deceit<br>52:24 - Friday the 13th<br>2:21:23 - Deceit

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [187586726](https://www.twitch.tv/videos/187586726) | [v187586726.ass](../chats/v187586726.ass) | [PYqnr5-Lq4o](https://www.youtube.com/watch?v=PYqnr5-Lq4o) | <a href="/src/player.html?v=PYqnr5-Lq4o&s=187586726" onclick="return openPlayer187586726()">▶</a> |

<script>
  function openPlayer187586726() {
    createPlayer("player-PYqnr5-Lq4o", "PYqnr5-Lq4o", "187586726");
    document.getElementById("spoiler-PYqnr5-Lq4o").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-PYqnr5-Lq4o"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-PYqnr5-Lq4o"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v187586726.ass ytdl://PYqnr5-Lq4o
```

----
## 23:30 - Dead by Daylight<br>2:09:00 - Pulsar: Lost Colony<br>4:02:50 - Deceit

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [200702885](https://www.twitch.tv/videos/200702885) | [v200702885.ass](../chats/v200702885.ass) | [qyMVUvAjqdE](https://www.youtube.com/watch?v=qyMVUvAjqdE) | <a href="/src/player.html?v=qyMVUvAjqdE&s=200702885" onclick="return openPlayer200702885()">▶</a> |

<script>
  function openPlayer200702885() {
    createPlayer("player-qyMVUvAjqdE", "qyMVUvAjqdE", "200702885");
    document.getElementById("spoiler-qyMVUvAjqdE").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-qyMVUvAjqdE"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-qyMVUvAjqdE"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v200702885.ass ytdl://qyMVUvAjqdE
```

----
## 21:00 - Human: Fall Flat<br>4:24:00 - Deceit

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [202631693](https://www.twitch.tv/videos/202631693) | [v202631693.ass](../chats/v202631693.ass) | [BL6BrZRmRts](https://www.youtube.com/watch?v=BL6BrZRmRts) | <a href="/src/player.html?v=BL6BrZRmRts&s=202631693" onclick="return openPlayer202631693()">▶</a> |

<script>
  function openPlayer202631693() {
    createPlayer("player-BL6BrZRmRts", "BL6BrZRmRts", "202631693");
    document.getElementById("spoiler-BL6BrZRmRts").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-BL6BrZRmRts"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-BL6BrZRmRts"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v202631693.ass ytdl://BL6BrZRmRts
```

----
## 23:00 - Looterkings<br>1:25:00 - Mount Your Friends<br>2:49:00 - We Need to Go Deeper<br>4:36:00 - Golf It!

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [206394832](https://www.twitch.tv/videos/206394832) | [v206394832.ass](../chats/v206394832.ass) | [-77Qpme-5EA](https://www.youtube.com/watch?v=-77Qpme-5EA) | <a href="/src/player.html?v=-77Qpme-5EA&s=206394832" onclick="return openPlayer206394832()">▶</a> |

<script>
  function openPlayer206394832() {
    createPlayer("player--77Qpme-5EA", "-77Qpme-5EA", "206394832");
    document.getElementById("spoiler--77Qpme-5EA").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler--77Qpme-5EA"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player--77Qpme-5EA"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v206394832.ass ytdl://-77Qpme-5EA
```

----
## 8:30 - Witch It<br>3:24:00 - PUBG

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [207753795](https://www.twitch.tv/videos/207753795) | [v207753795.ass](../chats/v207753795.ass) | [PPZFFjgxKnY](https://www.youtube.com/watch?v=PPZFFjgxKnY) | <a href="/src/player.html?v=PPZFFjgxKnY&s=207753795" onclick="return openPlayer207753795()">▶</a> |

<script>
  function openPlayer207753795() {
    createPlayer("player-PPZFFjgxKnY", "PPZFFjgxKnY", "207753795");
    document.getElementById("spoiler-PPZFFjgxKnY").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-PPZFFjgxKnY"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-PPZFFjgxKnY"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v207753795.ass ytdl://PPZFFjgxKnY
```

----
## 15:00 - The Hunter: Call of the Wild<br>3:10:00 - Road Redemption

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [213247693](https://www.twitch.tv/videos/213247693) | [v213247693.ass](../chats/v213247693.ass) | [GPga2h4UUXc](https://www.youtube.com/watch?v=GPga2h4UUXc) | <a href="/src/player.html?v=GPga2h4UUXc&s=213247693" onclick="return openPlayer213247693()">▶</a> |

<script>
  function openPlayer213247693() {
    createPlayer("player-GPga2h4UUXc", "GPga2h4UUXc", "213247693");
    document.getElementById("spoiler-GPga2h4UUXc").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-GPga2h4UUXc"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-GPga2h4UUXc"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v213247693.ass ytdl://GPga2h4UUXc
```

----
## 13:00 - Hand Simulator<br>1:58:00 - Viscera Cleanup Detail<br>3:00:00 - Astroneer<br>4:59:00 - Gang Beasts

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| [213846142](https://www.twitch.tv/videos/213846142) | [v213846142.ass](../chats/v213846142.ass) | [8GFZF96owuA](https://www.youtube.com/watch?v=8GFZF96owuA) | <a href="/src/player.html?v=8GFZF96owuA&s=213846142" onclick="return openPlayer213846142()">▶</a> |

<script>
  function openPlayer213846142() {
    createPlayer("player-8GFZF96owuA", "8GFZF96owuA", "213846142");
    document.getElementById("spoiler-8GFZF96owuA").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-8GFZF96owuA"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-8GFZF96owuA"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v213846142.ass ytdl://8GFZF96owuA
```

----

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше

