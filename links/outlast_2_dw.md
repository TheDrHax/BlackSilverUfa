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

# Outlast 2 с Дашей
 
<h2 id="0"><a href="#0">1</a></h2>

* Ссылки:
  * Twitch: [174697007](https://www.twitch.tv/videos/174697007)
  * Субтитры: [v174697007.ass](../chats/v174697007.ass)
  * Запись (YouTube): [-5aRKoYTGLs](https://www.youtube.com/watch?v=-5aRKoYTGLs)

<a onclick="return openPlayer0()" id="button-0">**▶ Открыть плеер**</a>

<script>
  var player0;
  function openPlayer0() {
    player0 = videojs("player-0", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v174697007.ass"],
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
        "src": "https://www.youtube.com/watch?v=-5aRKoYTGLs"
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
mpv --sub-file chats/v174697007.ass ytdl://-5aRKoYTGLs
```

---- 
 
<h2 id="1"><a href="#1">2</a></h2>

* Ссылки:
  * Twitch: [186799946](https://www.twitch.tv/videos/186799946)
  * Субтитры: [v186799946.ass](../chats/v186799946.ass)
  * Запись (ВКонтакте): [87862793_456240876](https://vk.com/video87862793_456240876)

<a onclick="return openPlayer1()" id="button-1">**▶ Открыть плеер**</a>

<script>
  var player1;
  function openPlayer1() {
    player1 = videojs("player-1", {
      controls: true, nativeControlsForTouch: false,
      width: 640, height: 360, fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v186799946.ass"],
          delay: -0.1,
        },
      },
    });
    document.getElementById("spoiler-1").click();
    document.getElementById("button-1").remove();
      $.getJSON("https://api.thedrhax.pw/vk/video/87862793_456240876", function(data) {
          console.log("Ссылка получена: " + data.url);
          player1.src([{type: 'video/mp4', src: data.url}]);
      });
    return false;
  }
</script>

<details>
  <summary id="spoiler-1"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-1" class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details> 
Примечание: Для этого стрима используется экспериментальный сервер, стабильность
которого уступает GitHub Pages. Если видео не запускается, сообщите мне через
раздел [Issues](https://github.com/TheDrHax/BlackSilverUfa/issues). Спасибо!

#### Команда для просмотра стрима в проигрывателе MPV

```
streamlink -p "mpv --sub-file chats/v186799946.ass" --player-passthrough hls twitch.tv/videos/186799946 best
```

---- 
 
Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* `git clone https://github.com/TheDrHax/BlackSilverUfa.git`
* `cd BlackSilverUfa`
* `git checkout gh-pages`
* Команда, приведённая выше