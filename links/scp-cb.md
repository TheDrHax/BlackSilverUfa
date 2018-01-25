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

# SCP Containment Breach
 
<h2 id="0"><a href="#0">1</a></h2>

* Ссылки:
  * Twitch: [215974261](https://www.twitch.tv/videos/215974261)
  * Субтитры: [v215974261.ass](../chats/v215974261.ass)
  * Запись (YouTube): [-8anORo35tQ](https://www.youtube.com/watch?v=-8anORo35tQ)

<a onclick="return openPlayer0()" id="button-0">**▶ Открыть плеер**</a>

<script>
  var player0;
  function openPlayer0() {
    player0 = videojs("player-0", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v215974261.ass"],
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
        "src": "https://www.youtube.com/watch?v=-8anORo35tQ"
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
mpv --sub-file chats/v215974261.ass ytdl://-8anORo35tQ
```

---- 
 
<h2 id="1"><a href="#1">2</a></h2>

* Ссылки:
  * Twitch: [CE21Sxn4xzE](https://www.twitch.tv/videos/CE21Sxn4xzE)
  * Субтитры: [vCE21Sxn4xzE.ass](../chats/vCE21Sxn4xzE.ass)
  * Запись: отсутствует
* Таймкоды:
  *  <a onclick="player1.currentTime(1260)">21:00</a>  - SCP Containment Breach Unity
  *  <a onclick="player1.currentTime(4140)">1:09:00</a>  - SCP Containment Breach

#### Команда для просмотра стрима в проигрывателе MPV

```
streamlink -p "mpv --sub-file chats/vCE21Sxn4xzE.ass" --player-passthrough hls twitch.tv/videos/CE21Sxn4xzE best
```

---- 
 
Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше