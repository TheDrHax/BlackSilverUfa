FROM python:3-alpine

RUN apk --no-cache add inotify-tools \
 && pip3 install mako pymorphy2 \
 && pip3 install -U https://github.com/TheDrHax/Twitch-Chat-Downloader/archive/master.zip

VOLUME /bsu
WORKDIR /bsu

ADD entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
