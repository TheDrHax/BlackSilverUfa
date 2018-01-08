#!/bin/sh

. templates/scripts/for_each.sh

generate_stream() {
    if [ $TWITCH != NULL ] && [ ! -e chats/v$TWITCH.ass ]; then
        echo "Скачиваю чат со стрима $TWITCH" > /dev/stderr
        python -m tcd $TWITCH > /dev/stderr
    fi

    # Данные для элемента
    TWITCH_LINK="[$TWITCH](https://www.twitch.tv/videos/$TWITCH)"
    CHAT_LINK="[v$TWITCH.ass](../chats/v$TWITCH.ass)"
    if echo $YOUTUBE | grep -q NULL; then
        YOUTUBE_LINK="Запись отсутствует"
        PLAYER_LINK=""
        PLAYER_CMD="streamlink -p \"mpv --sub-file chats/v$TWITCH.ass\" --player-passthrough hls twitch.tv/videos/$TWITCH best"
    else
        YOUTUBE_LINK="[$YOUTUBE](https://www.youtube.com/watch?v=$YOUTUBE)"
        PLAYER_LINK="<a href=\"/src/player.html?v=$YOUTUBE&s=$TWITCH\" onclick=\"return openPlayer$TWITCH()\">▶</a>"
        PLAYER_CMD="mpv --sub-file chats/v$TWITCH.ass ytdl://$YOUTUBE"
    fi

    cat <<EOF
## $NAME

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| $TWITCH_LINK | $CHAT_LINK | $YOUTUBE_LINK | $PLAYER_LINK |

<script>
  function openPlayer$TWITCH() {
    createPlayer("player-$YOUTUBE", "$YOUTUBE", "$TWITCH");
    document.getElementById("spoiler-$YOUTUBE").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-$YOUTUBE"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-$YOUTUBE"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

\`\`\`
$PLAYER_CMD
\`\`\`

----
EOF
}

generate_page() {
    list=$1
    TITLE=$(head -n1 "$list")

    cat <<EOF
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

# $TITLE

$(for_each_stream $list generate_stream)

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* \`git clone https://github.com/TheDrHax/BlackSilverUfa.git\`
* \`cd BlackSilverUfa\`
* \`git checkout gh-pages\`
* Команда, приведённая выше

EOF
}

mkdir -p links

for list in lists/*.list; do
    generate_page $list > $(echo "$list" | sed 's|lists/\(.*\)\.list|links/\1.md|g')
done
