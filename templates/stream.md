## $name

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| $TWITCH_LINK | $CHAT_LINK | $YOUTUBE_LINK | $PLAYER_LINK |

<script>
  function openPlayer$twitch() {
    createPlayer("player-$youtube", "$youtube", "$twitch");
    document.getElementById("spoiler-$youtube").click();
    return false;
  }
</script>

<details>
  <summary id="spoiler-$youtube"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video
      id="player-$youtube"
      class="video-js vjs-default-skin vjs-big-play-centered" />
  </div>
</details>

#### Команда для просмотра стрима в проигрывателе MPV

```
$PLAYER_CMD
```

----
