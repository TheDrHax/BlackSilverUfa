FROM python:3-alpine

RUN pip3 install mako pymorphy2 livereload \
 && pip3 install -U https://github.com/TheDrHax/Twitch-Chat-Downloader/archive/master.zip

VOLUME /bsu
WORKDIR /bsu

EXPOSE 8000
