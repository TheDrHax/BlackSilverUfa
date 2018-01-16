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

# The Evil Within
 
<h2 id="0"><a href="#0">1</a></h2>

* Примечание: Трансляция была прервана по техническим причинам
* Ссылки:
  * Twitch: [160844876](https://www.twitch.tv/videos/160844876)
  * Субтитры: [v160844876.ass](../chats/v160844876.ass)
  * Запись (ВКонтакте): [87862793_456240552](https://vk.com/video87862793_456240552)
* Стрим заканчивается в  <a onclick="player0.currentTime(3138)">52:18</a> 

<a onclick="return openPlayer0()" id="button-0">**▶ Открыть плеер**</a>

<script>
  var player0;
  function openPlayer0() {
    player0 = videojs("player-0", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v160844876.ass"],
          delay: -0.1,
        },
      },
    });
    document.getElementById("spoiler-0").click();
    document.getElementById("button-0").remove();
      $.getJSON("https://api.thedrhax.pw/vk/video/87862793_456240552", function(data) {
          console.log("Ссылка получена: " + data.url);
          player0.src([{type: 'video/mp4', src: data.url}]);
      });
      player0.duration = function() {
        return 3138; // the amount of seconds of video
      }
      player0.remainingTimeDisplay = function() {
        var a = Math.floor(this.duration()) - Math.floor(this.currentTime());
        if (a <= 0) this.pause();
        return a;
      }
    return false;
  }
</script>

<details>
  <summary id="spoiler-0"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-0" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details> 
Примечание: Для этого стрима используется экспериментальный сервер, стабильность
которого уступает GitHub Pages. Если видео не запускается, сообщите мне через
раздел [Issues](https://github.com/TheDrHax/BlackSilverUfa/issues). Спасибо!

#### Команда для просмотра стрима в проигрывателе MPV

```
streamlink -p "mpv --sub-file chats/v160844876.ass" --player-passthrough hls twitch.tv/videos/160844876 best
```

---- 
 
<h2 id="1"><a href="#1">1.5</a></h2>

* Ссылки:
  * Twitch: [160852861](https://www.twitch.tv/videos/160852861)
  * Субтитры: [v160852861.ass](../chats/v160852861.ass)
  * Запись (YouTube): [LF6RMOOvA9M](https://www.youtube.com/watch?v=LF6RMOOvA9M)

<a onclick="return openPlayer1()" id="button-1">**▶ Открыть плеер**</a>

<script>
  var player1;
  function openPlayer1() {
    player1 = videojs("player-1", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v160852861.ass"],
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
        "src": "https://www.youtube.com/watch?v=LF6RMOOvA9M"
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

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v160852861.ass ytdl://LF6RMOOvA9M
```

---- 
 
<h2 id="2"><a href="#2">2</a></h2>

* Примечание: Трансляция была прервана по техническим причинам
* Ссылки:
  * Twitch: [161110508](https://www.twitch.tv/videos/161110508)
  * Субтитры: [v161110508.ass](../chats/v161110508.ass)
  * Запись (YouTube): [8VCQkjjMu-I](https://www.youtube.com/watch?v=8VCQkjjMu-I)

<a onclick="return openPlayer2()" id="button-2">**▶ Открыть плеер**</a>

<script>
  var player2;
  function openPlayer2() {
    player2 = videojs("player-2", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v161110508.ass"],
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
        "src": "https://www.youtube.com/watch?v=8VCQkjjMu-I"
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

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v161110508.ass ytdl://8VCQkjjMu-I
```

---- 
 
<h2 id="3"><a href="#3">2.5</a></h2>

* Ссылки:
  * Twitch: [161115703](https://www.twitch.tv/videos/161115703)
  * Субтитры: [v161115703.ass](../chats/v161115703.ass)
  * Запись (YouTube): [vxbjz2-Lmgg](https://www.youtube.com/watch?v=vxbjz2-Lmgg)

<a onclick="return openPlayer3()" id="button-3">**▶ Открыть плеер**</a>

<script>
  var player3;
  function openPlayer3() {
    player3 = videojs("player-3", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v161115703.ass"],
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
        "src": "https://www.youtube.com/watch?v=vxbjz2-Lmgg"
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

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v161115703.ass ytdl://vxbjz2-Lmgg
```

---- 
 
<h2 id="4"><a href="#4">3</a></h2>

* Ссылки:
  * Twitch: [162350334](https://www.twitch.tv/videos/162350334)
  * Субтитры: [v162350334.ass](../chats/v162350334.ass)
  * Запись (YouTube): [hZSVfTxT7Qo](https://www.youtube.com/watch?v=hZSVfTxT7Qo)

<a onclick="return openPlayer4()" id="button-4">**▶ Открыть плеер**</a>

<script>
  var player4;
  function openPlayer4() {
    player4 = videojs("player-4", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v162350334.ass"],
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
        "src": "https://www.youtube.com/watch?v=hZSVfTxT7Qo"
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

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v162350334.ass ytdl://hZSVfTxT7Qo
```

---- 
 
<h2 id="5"><a href="#5">4</a></h2>

* Примечание: Трансляция была прервана по техническим причинам
* Ссылки:
  * Twitch: [162844424](https://www.twitch.tv/videos/162844424)
  * Субтитры: [v162844424.ass](../chats/v162844424.ass)
  * Запись (YouTube): [8lhCzaGLmK8](https://www.youtube.com/watch?v=8lhCzaGLmK8)

<a onclick="return openPlayer5()" id="button-5">**▶ Открыть плеер**</a>

<script>
  var player5;
  function openPlayer5() {
    player5 = videojs("player-5", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v162844424.ass"],
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
        "src": "https://www.youtube.com/watch?v=8lhCzaGLmK8"
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

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v162844424.ass ytdl://8lhCzaGLmK8
```

---- 
 
<h2 id="6"><a href="#6">5</a></h2>

* Ссылки:
  * Twitch: [163361169](https://www.twitch.tv/videos/163361169)
  * Субтитры: [v163361169.ass](../chats/v163361169.ass)
  * Запись (YouTube): [Qt1N7foBrUE](https://www.youtube.com/watch?v=Qt1N7foBrUE)

<a onclick="return openPlayer6()" id="button-6">**▶ Открыть плеер**</a>

<script>
  var player6;
  function openPlayer6() {
    player6 = videojs("player-6", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v163361169.ass"],
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
        "src": "https://www.youtube.com/watch?v=Qt1N7foBrUE"
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

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v163361169.ass ytdl://Qt1N7foBrUE
```

---- 
 
<h2 id="7"><a href="#7">6</a></h2>

* Примечание: Трансляция была прервана по техническим причинам
* Ссылки:
  * Twitch: [164116949](https://www.twitch.tv/videos/164116949)
  * Субтитры: [v164116949.ass](../chats/v164116949.ass)
  * Запись (YouTube): [5JOCDsqrhOY](https://www.youtube.com/watch?v=5JOCDsqrhOY)

<a onclick="return openPlayer7()" id="button-7">**▶ Открыть плеер**</a>

<script>
  var player7;
  function openPlayer7() {
    player7 = videojs("player-7", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v164116949.ass"],
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
        "src": "https://www.youtube.com/watch?v=5JOCDsqrhOY"
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

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v164116949.ass ytdl://5JOCDsqrhOY
```

---- 
 
<h2 id="8"><a href="#8">6.5</a></h2>

* Ссылки:
  * Twitch: [164165380](https://www.twitch.tv/videos/164165380)
  * Субтитры: [v164165380.ass](../chats/v164165380.ass)
  * Запись (YouTube): [yH9DIXACVkA](https://www.youtube.com/watch?v=yH9DIXACVkA)

<a onclick="return openPlayer8()" id="button-8">**▶ Открыть плеер**</a>

<script>
  var player8;
  function openPlayer8() {
    player8 = videojs("player-8", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v164165380.ass"],
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
        "src": "https://www.youtube.com/watch?v=yH9DIXACVkA"
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

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v164165380.ass ytdl://yH9DIXACVkA
```

---- 
 
Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше