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

# Monster Hunter World
 
<h2 id="0"><a href="#0">1</a></h2>

* Ссылки:
  * Twitch: [208349646](https://www.twitch.tv/videos/208349646)
  * Субтитры: [v208349646.ass](../chats/v208349646.ass)
  * Запись (YouTube): [gUtKWEEyzPE](https://www.youtube.com/watch?v=gUtKWEEyzPE)

<a onclick="return openPlayer0()" id="button-0">**▶ Открыть плеер**</a>

<script>
  var player0;
  function openPlayer0() {
    player0 = videojs("player-0", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v208349646.ass"],
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
        "src": "https://www.youtube.com/watch?v=gUtKWEEyzPE"
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

#### Команда для просмотра стрима в проигрывателе MPV

```
mpv --sub-file chats/v208349646.ass ytdl://gUtKWEEyzPE
```

---- 
 
<h2 id="1"><a href="#1">2</a></h2>

* Ссылки:
  * Twitch: [222538863](https://www.twitch.tv/videos/222538863)
  * Субтитры: [v222538863.ass](../chats/v222538863.ass)
  * Запись (YouTube): [R2H6m_lW7sE](https://www.youtube.com/watch?v=R2H6m_lW7sE)

<a onclick="return openPlayer1()" id="button-1">**▶ Открыть плеер**</a>

<script>
  var player1;
  function openPlayer1() {
    player1 = videojs("player-1", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v222538863.ass"],
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
        "src": "https://www.youtube.com/watch?v=R2H6m_lW7sE"
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
mpv --sub-file chats/v222538863.ass ytdl://R2H6m_lW7sE
```

---- 
 
Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше