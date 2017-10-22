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

for list in links/*.list; do

TITLE=$(head -n1 "$list")
LINES=$(grep -nE '(--)' "$list" | sed 's/:.*//g')

cat > $(echo "$list" | sed 's/\.list/.md/g') <<EOF
# $TITLE

| № | Twitch | Субтитры | YouTube | ▶ | Команда |
| --- | --- | --- | --- | --- | --- |
$(

for i in $LINES; do
    NAME=$(sed -n $((i+1))p "$list")
    TWITCH=$(sed -n $((i+2))p "$list")
    YOUTUBE=$(sed -n $((i+3))p "$list")

    if [ $TWITCH != NULL ] && [ ! -e chats/v$TWITCH.ass ]; then
        echo "Скачиваю чат со стрима $TWITCH" > /dev/stderr
        download_chat $TWITCH > /dev/stderr
    fi

    echo -n "| $NAME | [$TWITCH](https://www.twitch.tv/videos/$TWITCH) | [скачать](../chats/v$TWITCH.ass) | "

    if echo $YOUTUBE | grep -q NULL; then
        echo "Отсутствует | ⏹ | <details>\`streamlink -p \"mpv --sub-file chats/v$TWITCH.ass\" --player-passthrough hls twitch.tv/videos/$TWITCH best\`</details> |"
    elif ! echo $TWITCH | grep -q NULL; then
        echo "[$YOUTUBE](https://www.youtube.com/watch?v=$YOUTUBE) | [▶](../src/player.html?v=$YOUTUBE&s=$TWITCH) | <details>\`mpv --sub-file chats/v$TWITCH.ass ytdl://$YOUTUBE\`</details> |"
    fi
done

)

Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по [этой](../tutorials/watch-online.md) инструкции.

Быстрый старт:
* \`git clone https://github.com/TheDrHax/BlackSilverUfa.git\`
* \`cd BlackSilverUfa\`
* \`git checkout gh-pages\`
* Команда из таблицы выше

EOF
done
