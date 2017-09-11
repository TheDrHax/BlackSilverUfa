#!/bin/bash

function download_chat {
    if [ ! -e Twitch-Chat-Downloader ]; then
        git clone https://github.com/TheDrHax/Twitch-Chat-Downloader.git
    fi

    python Twitch-Chat-Downloader/app.py -v $1
}

for INPUT in links/*.list; do
    NAME=$(echo $INPUT | sed -e 's/.list//' -e 's/links\///g')
    OUTPUT="links/$NAME.md"

    STATE=0
    cat $INPUT | while read line; do
        if [ "$line" == "--" ]; then
            STATE=1
        elif [ $STATE -eq 0 ]; then
            echo "# $line" > $OUTPUT
            echo >> $OUTPUT
            echo "| № | Twitch | Субтитры | YouTube |  |" >> $OUTPUT
            echo "| --- | --- | --- | --- | --- |" >> $OUTPUT
            STATE=1
        elif [ $STATE -eq 1 ]; then
            LINE_NAME="$line"
            STATE=2
        elif [ $STATE -eq 2 ]; then
            LINE_TWITCH="$line"
            STATE=3
        elif [ $STATE -eq 3 ]; then
            LINE_YOUTUBE="$line"

            if [ "$LINE_TWITCH" != NULL ] && [ ! -e chats/v$LINE_TWITCH.ass ]; then
                download_chat $LINE_TWITCH
            fi

            if [ "$LINE_YOUTUBE" == "NULL" ]; then
                echo "| $LINE_NAME | [$LINE_TWITCH](https://www.twitch.tv/videos/$LINE_TWITCH) | [скачать](../chats/v$LINE_TWITCH.ass) | Отсутствует | ⏹ |" >> $OUTPUT
            elif [ "$LINE_TWITCH" != "NULL" ]; then
                echo "| $LINE_NAME | [$LINE_TWITCH](https://www.twitch.tv/videos/$LINE_TWITCH) | [скачать](../chats/v$LINE_TWITCH.ass) | [$LINE_YOUTUBE](https://www.youtube.com/watch?v=$LINE_YOUTUBE) | [▶](../src/player.html?v=$LINE_YOUTUBE&s=$LINE_TWITCH) |" >> $OUTPUT
            fi

            STATE=4
        fi
    done
done
