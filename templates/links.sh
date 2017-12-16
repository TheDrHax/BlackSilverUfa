#!/bin/sh

download_chat() {
    if [ ! -e Twitch-Chat-Downloader ]; then
        git clone https://github.com/TheDrHax/Twitch-Chat-Downloader.git
    else
        cd Twitch-Chat-Downloader
        git pull --force
        cd ..
    fi

    python Twitch-Chat-Downloader/app.py $1 || exit 1
}

parse_stream() {
    offset=$1
    NAME=$(sed -n $((offset+1))p "$list")
    TWITCH=$(sed -n $((offset+2))p "$list")
    YOUTUBE=$(sed -n $((offset+3))p "$list")

    if [ $TWITCH != NULL ] && [ ! -e chats/v$TWITCH.ass ]; then
        echo "Скачиваю чат со стрима $TWITCH" > /dev/stderr
        download_chat $TWITCH > /dev/stderr
    fi

    # Данные для элемента
    TWITCH_LINK="[$TWITCH](https://www.twitch.tv/videos/$TWITCH)"
    CHAT_LINK="[v$TWITCH.ass](../chats/v$TWITCH.ass)"
    if echo $YOUTUBE | grep -q NULL; then
        YOUTUBE_LINK="Запись отсутствует"
        PLAYER_CMD="streamlink -p \"mpv --sub-file chats/v$TWITCH.ass\" --player-passthrough hls twitch.tv/videos/$TWITCH best"
        PLAYER_LINK=""
    else
        YOUTUBE_LINK="[$YOUTUBE](https://www.youtube.com/watch?v=$YOUTUBE)"
        PLAYER_CMD="mpv --sub-file chats/v$TWITCH.ass ytdl://$YOUTUBE"
        PLAYER_LINK="[▶](../src/player.html?v=$YOUTUBE&s=$TWITCH)"
    fi

cat <<EOF
## $NAME

| Twitch | Субтитры | YouTube | ▶ |
| ------ | -------- | ------- | - |
| $TWITCH_LINK | $CHAT_LINK | $YOUTUBE_LINK | $PLAYER_LINK |

### Команда для запуска плеера

\`\`\`
$PLAYER_CMD
\`\`\`
EOF
}

generate_page() {
    list=$1
    TITLE=$(head -n1 "$list")
    LINES=$(grep -nE '(--)' "$list" | sed 's/:.*//g')

cat <<EOF
# $TITLE

`
for i in $LINES; do
    parse_stream $i
    echo "----"
done
`

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* \`git clone https://github.com/TheDrHax/BlackSilverUfa.git\`
* \`cd BlackSilverUfa\`
* \`git checkout gh-pages\`
* Команда из таблицы выше

EOF
}

mkdir -p links

for list in lists/*.list; do
    generate_page $list > $(echo "$list" | sed 's|lists/\(.*\)\.list|links/\1.md|g')
done
