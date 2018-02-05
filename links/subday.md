<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
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

<style>
  .main-content {
    padding: 2rem;
    max-width: 72rem;
  }
</style>

# Sub-Day и стримы с несколькими играми
 
<h2 id="0"><a href="#0">1</a></h2>

* Ссылки:
  * Twitch: [180397849](https://www.twitch.tv/videos/180397849)
  * Субтитры: [v180397849.ass](../chats/v180397849.ass)
   * Запись (YouTube): [x5KwWrLRpEg](https://www.youtube.com/watch?v=x5KwWrLRpEg) 
* Таймкоды:
  *  <a onclick="player0.currentTime(1046)">17:26</a>  - Road Redemption
  *  <a onclick="player0.currentTime(4576)">1:16:16</a>  - Battle Chasers
  *  <a onclick="player0.currentTime(10665)">2:57:45</a>  - Stardew Valley


<a onclick="return openPlayer0()" id="button-0">**▶ Открыть плеер**</a>

<script>
  var player0;
  function openPlayer0() {
    player0 = videojs("player-0", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v180397849.ass"],
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
        "src": "https://www.youtube.com/watch?v=x5KwWrLRpEg"
      }]
    });
    document.getElementById("spoiler-0").click();
    document.getElementById("button-0").remove();
    return false;
  }
</script>

<details>
  <summary id="spoiler-0"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-0" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '0')
      openPlayer0();
</script> 

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v180397849.ass ytdl://x5KwWrLRpEg
```

---- 
 
<h2 id="1"><a href="#1">2</a></h2>

* Ссылки:
  * Twitch: [212431882](https://www.twitch.tv/videos/212431882)
  * Субтитры: [v212431882.ass](../chats/v212431882.ass)
   * Запись (YouTube): [JS7cNXnzCTA](https://www.youtube.com/watch?v=JS7cNXnzCTA) 
* Таймкоды:
  *  <a onclick="player1.currentTime(1247)">20:47</a>  - Uncanny Valley
  *  <a onclick="player1.currentTime(6294)">1:44:54</a>  - The Coma: Recut
  *  <a onclick="player1.currentTime(10320)">2:52:00</a>  - Lone Survivor


<a onclick="return openPlayer1()" id="button-1">**▶ Открыть плеер**</a>

<script>
  var player1;
  function openPlayer1() {
    player1 = videojs("player-1", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v212431882.ass"],
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
        "src": "https://www.youtube.com/watch?v=JS7cNXnzCTA"
      }]
    });
    document.getElementById("spoiler-1").click();
    document.getElementById("button-1").remove();
    return false;
  }
</script>

<details>
  <summary id="spoiler-1"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-1" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '1')
      openPlayer1();
</script> 

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v212431882.ass ytdl://JS7cNXnzCTA
```

---- 
 
<h2 id="2"><a href="#2">3</a></h2>

* Ссылки:
  * Twitch: [212678883](https://www.twitch.tv/videos/212678883)
  * Субтитры: [v212678883.ass](../chats/v212678883.ass)
   * Запись (YouTube): [sz8y749Jn_8](https://www.youtube.com/watch?v=sz8y749Jn_8) 
* Таймкоды:
  *  <a onclick="player2.currentTime(1500)">25:00</a>  - Stifled
  *  <a onclick="player2.currentTime(10740)">2:59:00</a>  - Uncanny Valley


<a onclick="return openPlayer2()" id="button-2">**▶ Открыть плеер**</a>

<script>
  var player2;
  function openPlayer2() {
    player2 = videojs("player-2", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v212678883.ass"],
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
        "src": "https://www.youtube.com/watch?v=sz8y749Jn_8"
      }]
    });
    document.getElementById("spoiler-2").click();
    document.getElementById("button-2").remove();
    return false;
  }
</script>

<details>
  <summary id="spoiler-2"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-2" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '2')
      openPlayer2();
</script> 

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v212678883.ass ytdl://sz8y749Jn_8
```

---- 
 
<h2 id="3"><a href="#3">4</a></h2>

* Ссылки:
  * Twitch: [222198164](https://www.twitch.tv/videos/222198164)
  * Субтитры: [v222198164.ass](../chats/v222198164.ass)
   * Запись (YouTube): [x9NkgWX09L0](https://www.youtube.com/watch?v=x9NkgWX09L0) 
* Таймкоды:
  *  <a onclick="player3.currentTime(1560)">26:00</a>  - The Witchkin
  *  <a onclick="player3.currentTime(6934)">1:55:34</a>  - Emily Wants to Play Too
  *  <a onclick="player3.currentTime(11873)">3:17:53</a>  - LeftWay


<a onclick="return openPlayer3()" id="button-3">**▶ Открыть плеер**</a>

<script>
  var player3;
  function openPlayer3() {
    player3 = videojs("player-3", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v222198164.ass"],
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
        "src": "https://www.youtube.com/watch?v=x9NkgWX09L0"
      }]
    });
    document.getElementById("spoiler-3").click();
    document.getElementById("button-3").remove();
    return false;
  }
</script>

<details>
  <summary id="spoiler-3"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-3" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '3')
      openPlayer3();
</script> 

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v222198164.ass ytdl://x9NkgWX09L0
```

---- 
 
Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше