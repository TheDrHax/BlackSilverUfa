#!/bin/sh

if [ "_$1" = "_serve" ]; then
    python -m http.server & PID_SERVER=$!
    $2

    trap break EXIT
    while true; do
        find . \
            | grep -E "\.(py|mako|js|json)$" \
            | xargs inotifywait -e modify \
            && $2
    done

    kill $PID_SERVER
    exit 0
fi

exec "$@"
