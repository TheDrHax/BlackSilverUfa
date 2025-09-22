# docker run --privileged --rm tonistiigi/binfmt --install all
# docker buildx build --push --platform linux/arm64/v8,linux/amd64 -t thedrhax/buildenv-blackufa -f build/Dockerfile .

FROM python:3.10.18-slim

RUN apt update \
 && apt -y install build-essential git openssh-client curl ffmpeg \
 && apt clean

RUN useradd -m user
RUN echo 'StrictHostKeyChecking no' >> /etc/ssh/ssh_config

ENV TZ=Europe/Moscow
USER user
WORKDIR /home/user

ENTRYPOINT ["/bin/bash"]