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

# Darkwood
 
<h2 id="0"><a href="#0">1</a></h2>

* Ссылки:
  * Twitch: [172968603](https://www.twitch.tv/videos/172968603)
  * Субтитры: [v172968603.ass](../chats/v172968603.ass)
  * Запись (YouTube): [fxwks5MC9Ns](https://www.youtube.com/watch?v=fxwks5MC9Ns)

<a onclick="return openPlayer0()" id="button-0">**▶ Открыть плеер**</a>

<script>
  var player0;
  function openPlayer0() {
    player0 = videojs("player-0", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v172968603.ass"],
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
        "src": "https://www.youtube.com/watch?v=fxwks5MC9Ns"
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
mpv --sub-file chats/v172968603.ass ytdl://fxwks5MC9Ns
```

---- 
 
<h2 id="1"><a href="#1">2</a></h2>

* Ссылки:
  * Twitch: [176397641](https://www.twitch.tv/videos/176397641)
  * Субтитры: [v176397641.ass](../chats/v176397641.ass)
  * Запись (YouTube): [yxlbqLonbKI](https://www.youtube.com/watch?v=yxlbqLonbKI)

<a onclick="return openPlayer1()" id="button-1">**▶ Открыть плеер**</a>

<script>
  var player1;
  function openPlayer1() {
    player1 = videojs("player-1", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v176397641.ass"],
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
        "src": "https://www.youtube.com/watch?v=yxlbqLonbKI"
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
mpv --sub-file chats/v176397641.ass ytdl://yxlbqLonbKI
```

---- 
 
<h2 id="2"><a href="#2">3</a></h2>

* Ссылки:
  * Twitch: [177634045](https://www.twitch.tv/videos/177634045)
  * Субтитры: [v177634045.ass](../chats/v177634045.ass)
  * Запись (YouTube): [NR3Acyrhnp4](https://www.youtube.com/watch?v=NR3Acyrhnp4)

<a onclick="return openPlayer2()" id="button-2">**▶ Открыть плеер**</a>

<script>
  var player2;
  function openPlayer2() {
    player2 = videojs("player-2", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v177634045.ass"],
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
        "src": "https://www.youtube.com/watch?v=NR3Acyrhnp4"
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
mpv --sub-file chats/v177634045.ass ytdl://NR3Acyrhnp4
```

---- 
 
<h2 id="3"><a href="#3">4</a></h2>

* Ссылки:
  * Twitch: [179635876](https://www.twitch.tv/videos/179635876)
  * Субтитры: [v179635876.ass](../chats/v179635876.ass)
  * Запись (YouTube): [zxTKOfKANt8](https://www.youtube.com/watch?v=zxTKOfKANt8)

<a onclick="return openPlayer3()" id="button-3">**▶ Открыть плеер**</a>

<script>
  var player3;
  function openPlayer3() {
    player3 = videojs("player-3", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v179635876.ass"],
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
        "src": "https://www.youtube.com/watch?v=zxTKOfKANt8"
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
mpv --sub-file chats/v179635876.ass ytdl://zxTKOfKANt8
```

---- 
 
<h2 id="4"><a href="#4">5</a></h2>

* Ссылки:
  * Twitch: [179882105](https://www.twitch.tv/videos/179882105)
  * Субтитры: [v179882105.ass](../chats/v179882105.ass)
  * Запись (YouTube): [r6fssOx-GCQ](https://www.youtube.com/watch?v=r6fssOx-GCQ)

<a onclick="return openPlayer4()" id="button-4">**▶ Открыть плеер**</a>

<script>
  var player4;
  function openPlayer4() {
    player4 = videojs("player-4", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v179882105.ass"],
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
        "src": "https://www.youtube.com/watch?v=r6fssOx-GCQ"
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
mpv --sub-file chats/v179882105.ass ytdl://r6fssOx-GCQ
```

---- 
 
<h2 id="5"><a href="#5">6</a></h2>

* Ссылки:
  * Twitch: [201707253](https://www.twitch.tv/videos/201707253)
  * Субтитры: [v201707253.ass](../chats/v201707253.ass)
  * Запись (YouTube): [quashvbtL-M](https://www.youtube.com/watch?v=quashvbtL-M)

<a onclick="return openPlayer5()" id="button-5">**▶ Открыть плеер**</a>

<script>
  var player5;
  function openPlayer5() {
    player5 = videojs("player-5", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v201707253.ass"],
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
        "src": "https://www.youtube.com/watch?v=quashvbtL-M"
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
mpv --sub-file chats/v201707253.ass ytdl://quashvbtL-M
```

---- 
 
<h2 id="6"><a href="#6">7</a></h2>

* Ссылки:
  * Twitch: [203147401](https://www.twitch.tv/videos/203147401)
  * Субтитры: [v203147401.ass](../chats/v203147401.ass)
  * Запись (YouTube): [xSMy8oGoWnQ](https://www.youtube.com/watch?v=xSMy8oGoWnQ)

<a onclick="return openPlayer6()" id="button-6">**▶ Открыть плеер**</a>

<script>
  var player6;
  function openPlayer6() {
    player6 = videojs("player-6", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v203147401.ass"],
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
        "src": "https://www.youtube.com/watch?v=xSMy8oGoWnQ"
      }]
    });
    document.getElementById("spoiler-6").click();
    document.getElementById("button-6").remove();
    return false;
  }
</script>

<details>
  <summary id="spoiler-6"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-6" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '6')
      openPlayer6();
</script> 

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v203147401.ass ytdl://xSMy8oGoWnQ
```

---- 
 
<h2 id="7"><a href="#7">8</a></h2>

* Ссылки:
  * Twitch: [204186576](https://www.twitch.tv/videos/204186576)
  * Субтитры: [v204186576.ass](../chats/v204186576.ass)
  * Запись (YouTube): [kEzcaYOhHaQ](https://www.youtube.com/watch?v=kEzcaYOhHaQ)

<a onclick="return openPlayer7()" id="button-7">**▶ Открыть плеер**</a>

<script>
  var player7;
  function openPlayer7() {
    player7 = videojs("player-7", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v204186576.ass"],
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
        "src": "https://www.youtube.com/watch?v=kEzcaYOhHaQ"
      }]
    });
    document.getElementById("spoiler-7").click();
    document.getElementById("button-7").remove();
    return false;
  }
</script>

<details>
  <summary id="spoiler-7"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-7" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '7')
      openPlayer7();
</script> 

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v204186576.ass ytdl://kEzcaYOhHaQ
```

---- 
 
<h2 id="8"><a href="#8">9</a></h2>

* Ссылки:
  * Twitch: [206091904](https://www.twitch.tv/videos/206091904)
  * Субтитры: [v206091904.ass](../chats/v206091904.ass)
  * Запись (YouTube): [-amaLXxGG30](https://www.youtube.com/watch?v=-amaLXxGG30)

<a onclick="return openPlayer8()" id="button-8">**▶ Открыть плеер**</a>

<script>
  var player8;
  function openPlayer8() {
    player8 = videojs("player-8", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v206091904.ass"],
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
        "src": "https://www.youtube.com/watch?v=-amaLXxGG30"
      }]
    });
    document.getElementById("spoiler-8").click();
    document.getElementById("button-8").remove();
    return false;
  }
</script>

<details>
  <summary id="spoiler-8"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-8" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '8')
      openPlayer8();
</script> 

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v206091904.ass ytdl://-amaLXxGG30
```

---- 
 
<h2 id="9"><a href="#9">10</a></h2>

* Ссылки:
  * Twitch: [207478875](https://www.twitch.tv/videos/207478875)
  * Субтитры: [v207478875.ass](../chats/v207478875.ass)
  * Запись (YouTube): [30i6tsz6xmw](https://www.youtube.com/watch?v=30i6tsz6xmw)

<a onclick="return openPlayer9()" id="button-9">**▶ Открыть плеер**</a>

<script>
  var player9;
  function openPlayer9() {
    player9 = videojs("player-9", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v207478875.ass"],
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
        "src": "https://www.youtube.com/watch?v=30i6tsz6xmw"
      }]
    });
    document.getElementById("spoiler-9").click();
    document.getElementById("button-9").remove();
    return false;
  }
</script>

<details>
  <summary id="spoiler-9"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-9" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '9')
      openPlayer9();
</script> 

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v207478875.ass ytdl://30i6tsz6xmw
```

---- 
 
<h2 id="10"><a href="#10">11</a></h2>

* Ссылки:
  * Twitch: [210024030](https://www.twitch.tv/videos/210024030)
  * Субтитры: [v210024030.ass](../chats/v210024030.ass)
  * Запись (YouTube): [FAjRM5KGsnw](https://www.youtube.com/watch?v=FAjRM5KGsnw)

<a onclick="return openPlayer10()" id="button-10">**▶ Открыть плеер**</a>

<script>
  var player10;
  function openPlayer10() {
    player10 = videojs("player-10", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v210024030.ass"],
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
        "src": "https://www.youtube.com/watch?v=FAjRM5KGsnw"
      }]
    });
    document.getElementById("spoiler-10").click();
    document.getElementById("button-10").remove();
    return false;
  }
</script>

<details>
  <summary id="spoiler-10"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-10" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

<script>
  if (window.location.hash)
    if (window.location.hash.replace('#', '') == '10')
      openPlayer10();
</script> 

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v210024030.ass ytdl://FAjRM5KGsnw
```

---- 
 
Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше