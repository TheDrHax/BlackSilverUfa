# Проигрыватель YouTube с субтитрами

Проигрыватель немного корявый, но свою основную функцию выполняет. Стриминг видео идет с YouTube, субтитры берутся из этого репозитория. Также плеер умеет продолжать воспроизведение с места последней остановки.

<link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.5.3/video-js.min.css" rel="stylesheet">
<link href="libjass.css" rel="stylesheet">
<link href="videojs.ass.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.5.3/video.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-youtube/2.0.7/Youtube.min.js"></script>
<script src="libjass.js"></script>
<script src="videojs.ass.js"></script>
<script src="videojs-resolution-switcher.js"></script>

<style>
    .header {
      display: flex;
      align-items: center;
    }

    .back {
      flex: 0;
      margin: 0 1rem;
      text-decoration: none;
      white-space: nowrap;
    }
</style>

<div class="player-wrapper">
    <video id="player" class="video-js vjs-default-skin vjs-big-play-centered"></video>
</div>

<script>
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        console.log('Query variable %s not found', variable);
    }

    videojs('player', {
      controls: true,
      nativeControlsForTouch: false,
      width: 640,
      height: 360,
      fluid: true,
      plugins: {
        ass: {
          src: ["../chats/v" + getQueryVariable("s") + ".ass"],
          delay: -0.1,
        },
        videoJsResolutionSwitcher: {
          default: 'high',
          dynamicLabel: true
        }
      },
      techOrder: ["youtube"],
      sources: [{"type": "video/youtube", "src": "https://www.youtube.com/watch?v=" + getQueryVariable("v")}]
    });
</script>

Если вы не видите субтитры, попробуйте перевести видео в полноэкранный режим. После этого они должны появиться и в обычном режиме.

Спасибо проектам [videojs](https://github.com/videojs/video.js), [libjass](https://github.com/Arnavion/libjass) и [videojs-ass](https://github.com/SunnyLi/videojs-ass) за такую удобную штуку. ![](https://static-cdn.jtvnw.net/emoticons/v1/41/1.0)
