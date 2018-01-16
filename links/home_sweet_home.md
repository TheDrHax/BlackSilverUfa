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

# Home Sweet Home
 
<h2 id="0"><a href="#0">1</a></h2>

* Ссылки:
  * Twitch: [178108639](https://www.twitch.tv/videos/178108639)
  * Субтитры: [v178108639.ass](../chats/v178108639.ass)
  * Запись (YouTube): [kgAipkmGNis](https://www.youtube.com/watch?v=kgAipkmGNis)

<a onclick="return openPlayer0()" id="button-0">**▶ Открыть плеер**</a>

<script>
  var player0;
  function openPlayer0() {
    player0 = videojs("player-0", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v178108639.ass"],
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
        "src": "https://www.youtube.com/watch?v=kgAipkmGNis"
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
mpv --sub-file chats/v178108639.ass ytdl://kgAipkmGNis
```

---- 
 
Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше