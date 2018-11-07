FROM python:3-alpine

ENV TZ=Europe/Moscow

RUN apk --no-cache add tzdata git \
 && pip3 install mako pymorphy2 livereload GitPython babel \
 && pip3 install -U https://github.com/TheDrHax/Twitch-Chat-Downloader/archive/2.3.1.zip

VOLUME /bsu
WORKDIR /bsu

EXPOSE 8000
