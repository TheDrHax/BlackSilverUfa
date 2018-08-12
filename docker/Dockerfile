FROM python:3-alpine

RUN pip3 install mako pymorphy2 livereload \
 && pip3 install -U https://github.com/TheDrHax/Twitch-Chat-Downloader/archive/2.2.1.zip

VOLUME /bsu
WORKDIR /bsu

EXPOSE 8000
