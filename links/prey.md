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

# Prey
 
<h2 id="0"><a href="#0">1</a></h2>

* Ссылки:
  * Twitch: [140288888](https://www.twitch.tv/videos/140288888)
  * Субтитры: [v140288888.ass](../chats/v140288888.ass)
  * Запись (YouTube): [Og2_fkJo8NY](https://www.youtube.com/watch?v=Og2_fkJo8NY)

<a onclick="return openPlayer0()" id="button-0">**▶ Открыть плеер**</a>

<script>
  var player0;
  function openPlayer0() {
    player0 = videojs("player-0", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v140288888.ass"],
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
        "src": "https://www.youtube.com/watch?v=Og2_fkJo8NY"
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
mpv --sub-file chats/v140288888.ass ytdl://Og2_fkJo8NY
```

---- 
 
<h2 id="1"><a href="#1">2</a></h2>

* Ссылки:
  * Twitch: [140295699](https://www.twitch.tv/videos/140295699)
  * Субтитры: [v140295699.ass](../chats/v140295699.ass)
  * Запись (YouTube): [x8lucgXcyfk](https://www.youtube.com/watch?v=x8lucgXcyfk)

<a onclick="return openPlayer1()" id="button-1">**▶ Открыть плеер**</a>

<script>
  var player1;
  function openPlayer1() {
    player1 = videojs("player-1", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v140295699.ass"],
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
        "src": "https://www.youtube.com/watch?v=x8lucgXcyfk"
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
mpv --sub-file chats/v140295699.ass ytdl://x8lucgXcyfk
```

---- 
 
<h2 id="2"><a href="#2">3</a></h2>

* Ссылки:
  * Twitch: [140548655](https://www.twitch.tv/videos/140548655)
  * Субтитры: [v140548655.ass](../chats/v140548655.ass)
  * Запись (YouTube): [vbAftlMvoB8](https://www.youtube.com/watch?v=vbAftlMvoB8)

<a onclick="return openPlayer2()" id="button-2">**▶ Открыть плеер**</a>

<script>
  var player2;
  function openPlayer2() {
    player2 = videojs("player-2", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v140548655.ass"],
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
        "src": "https://www.youtube.com/watch?v=vbAftlMvoB8"
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
mpv --sub-file chats/v140548655.ass ytdl://vbAftlMvoB8
```

---- 
 
<h2 id="3"><a href="#3">4</a></h2>

* Ссылки:
  * Twitch: [141300323](https://www.twitch.tv/videos/141300323)
  * Субтитры: [v141300323.ass](../chats/v141300323.ass)
  * Запись (YouTube): [u2jhKbGE7jY](https://www.youtube.com/watch?v=u2jhKbGE7jY)

<a onclick="return openPlayer3()" id="button-3">**▶ Открыть плеер**</a>

<script>
  var player3;
  function openPlayer3() {
    player3 = videojs("player-3", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v141300323.ass"],
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
        "src": "https://www.youtube.com/watch?v=u2jhKbGE7jY"
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
mpv --sub-file chats/v141300323.ass ytdl://u2jhKbGE7jY
```

---- 
 
<h2 id="4"><a href="#4">5</a></h2>

* Ссылки:
  * Twitch: [141516144](https://www.twitch.tv/videos/141516144)
  * Субтитры: [v141516144.ass](../chats/v141516144.ass)
  * Запись (YouTube): [qL_kIUCWWIY](https://www.youtube.com/watch?v=qL_kIUCWWIY)

<a onclick="return openPlayer4()" id="button-4">**▶ Открыть плеер**</a>

<script>
  var player4;
  function openPlayer4() {
    player4 = videojs("player-4", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v141516144.ass"],
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
        "src": "https://www.youtube.com/watch?v=qL_kIUCWWIY"
      }]
    });
    document.getElementById("spoiler-4").click();
    document.getElementById("button-4").remove();
    return false;
  }
</script>

<details>
  <summary id="spoiler-4"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-4" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '4')
      openPlayer4();
</script> 

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v141516144.ass ytdl://qL_kIUCWWIY
```

---- 
 
<h2 id="5"><a href="#5">6</a></h2>

* Ссылки:
  * Twitch: [142839507](https://www.twitch.tv/videos/142839507)
  * Субтитры: [v142839507.ass](../chats/v142839507.ass)
  * Запись (YouTube): [xvSuZzQ9CpM](https://www.youtube.com/watch?v=xvSuZzQ9CpM)

<a onclick="return openPlayer5()" id="button-5">**▶ Открыть плеер**</a>

<script>
  var player5;
  function openPlayer5() {
    player5 = videojs("player-5", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v142839507.ass"],
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
        "src": "https://www.youtube.com/watch?v=xvSuZzQ9CpM"
      }]
    });
    document.getElementById("spoiler-5").click();
    document.getElementById("button-5").remove();
    return false;
  }
</script>

<details>
  <summary id="spoiler-5"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-5" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '5')
      openPlayer5();
</script> 

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