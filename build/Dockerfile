# docker.thedrhax.pw/buildenv-blackufa

FROM python:3.9-slim

RUN apt update \
 && apt -y install build-essential git openssh-client curl \
 && apt clean

RUN useradd -m user
RUN echo 'StrictHostKeyChecking no' >> /etc/ssh/ssh_config

ENV TZ=Europe/Moscow
USER user
WORKDIR /home/user

ENTRYPOINT ["/bin/sh"]