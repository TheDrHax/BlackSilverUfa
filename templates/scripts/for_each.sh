#!/bin/sh

for_each_stream() {
    LINES=$(grep -nE '(--)' "$1" | sed 's/:.*//g')

    for offset in $LINES; do
        NAME=$(sed -n $((offset+1))p "$1")
        TWITCH=$(sed -n $((offset+2))p "$1")
        YOUTUBE=$(sed -n $((offset+3))p "$1")

        export NAME TWITCH YOUTUBE
        $2
    done
}
