# Архив чата BlackUFA_Twitch

В этот репозиторий будет выборочно помещаться история соообщений из чата на определённых стримах в формате субтитров ASS. Поддерживаются цвета ников, однако смайлов нет (не представляю, возможно ли это вообще).

Для скачивания используется отличный Python скрипт [Twitch Chat Downloader](https://github.com/PetterKraabol/Twitch-Chat-Downloader). Настройки формата субтитров находятся в файле settings.json.

## Как скачивать чат в виде субтитров?

Пока что это немного сложно, но, надеюсь, получится упростить этот процесс в будущем. ![](https://static-cdn.jtvnw.net/emoticons/v1/180319/1.0)

### Подготовка (нужно выполнить всего один раз)

Установим необходимые компоненты:

```bash
sudo apt-get install python-pip git
```

> Примечание: преведены названия пакетов для Debian-based систем (Debian, Ubuntu, Linux Mint и т.п.). Было бы круто, если кто-нибудь написал бы, как сделать это всё на Windows.

После их установки нужно скачать этот репозиторий и репозиторий со скриптом:

```bash
git clone https://github.com/TheDrHax/BlackSilverUFA.git
cd BlackSilverUFA
git clone https://github.com/PetterKraabol/Twitch-Chat-Downloader.git
```

> Примечание: Все дальнейшие команды выполняются внутри директории BlackSilverUFA. Если вы захотите загрузить субтитры к очередному стриму, вам нужно будет вернуться сюда с помощью команды `cd`.

Установим зависимости для скрипта:

```bash
sudo pip install -r Twitch-Chat-Downloader/requirements.txt
```

### Скачивание чата

Нам понадобится заполучить ссылку на запись стрима на Twitch. Например, такую: `https://www.twitch.tv/videos/126330909`. Берём из неё номер видео и подставляем в следующую команду:

```bash
python Twitch-Chat-Downloader/app.py -v НОМЕР
```

Ждём несколько минут и наслаждаемся новыми субтитрами `chats/vНОМЕР.ass`! ![](https://static-cdn.jtvnw.net/emoticons/v1/180325/1.0)

## Как смотреть запись стрима с этими субтитрами?

Сначала я скачивал стримы прямо с Twitch на жёсткий диск с помощью streamlink (livestreamer), но потом нашёл более удобный способ, который позволяет не забивать место на жёстком диске. Зачем скачивать видео, если его можно смотреть прямо с видеохостинга? ![](https://static-cdn.jtvnw.net/emoticons/v1/180334/1.0)

### Подготовка (аналогично, только один раз)

В зависимости от того, откуда вы собираетесь стримить, нам понадобятся следующие программы:

* Twitch: streamlink, mpv
* YouTube: youtube-dl, mpv

Насколько я знаю (но это не точно), все эти программы доступны для Windows. Но инструкция для Windows всё-равно будет отличаться.

#### Streamlink

Этот форк livestreamer позволяет смотреть видео с Twitch, YouTube и многих других сайтов без использования тяжёлых браузерных плееров. Нам он потребуется для стриминга видео с Twitch прямо в плеер mpv.

```bash
sudo apt-get install python-pip
sudo pip install streamlink
```

#### YouTube-dl

На момент написания этой инструкции версия youtube-dl из репозиториев Ubuntu опять устарела и перестала работать, поэтому устанавливать его будем напрямую с официального сайта.

```bash
sudo wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl
sudo chmod a+rx /usr/local/bin/youtube-dl
```

В дальнейшем, если он опять перестанет работать, можно просто выполнить команду `sudo youtube-dl -U`, чтобы обновить его до последней версии.

#### MPV

Это лучший плеер из всех, что я видел! У него практически нет интерфейса, но он просто летает даже на Raspberry Pi. В качестве приятного бонуса он умеет сохранять последнюю позицию на видео, чтобы просмотр можно было продолжить ровно с того же места. Чтобы сохранить текущую позицию, нужно закрыть плеер сочетанием клавиш **Shift+Q**.

```bash
sudo apt-get install mpv
```

### Просмотр видео с субтитрами

* Стриминг с Twitch

```bash
streamlink -p "mpv --sub-file СУБТИТРЫ" --player-passthrough hls ССЫЛКА_НА_TWITCH best
```

Аргумент `--player-passthrough hls` тут нужен для того, чтобы видео можно было перематывать прямо в плеере.

* Стриминг с YouTube

```bash
mpv --sub-file СУБТИТРЫ ССЫЛКА_НА_YOUTUBE
```

Вариант с YouTube годаздо проще и зачастую предоставляет лучшее качество видео.

# Содержание архива и ссылки на видео

## The Legend of Zelda: Breath of the Wild

| № | Twitch | YouTube | Субтитры |
| --- | --- | --- | --- |
| 1 | [126330909](https://www.twitch.tv/videos/126330909) | [G5waS5gtIlg](https://www.youtube.com/watch?v=G5waS5gtIlg) | [скачать](chats/v126330909.ass) |
| 2 | [126599870](https://www.twitch.tv/videos/126599870) | [jAqFcUpBoZ4](https://www.youtube.com/watch?v=jAqFcUpBoZ4) | [скачать](chats/v126599870.ass) |
| 3 | [127934409](https://www.twitch.tv/videos/127934409) | [hFg4gYQ5Pac](https://www.youtube.com/watch?v=hFg4gYQ5Pac) | [скачать](chats/v127934409.ass) |
| 4 | [128632418](https://www.twitch.tv/videos/128632418) | [vP0EEDw30PY](https://www.youtube.com/watch?v=vP0EEDw30PY) | [скачать](chats/v128632418.ass) |
| 5 | [129517728](https://www.twitch.tv/videos/129517728) | [BKDEwpqADjo](https://www.youtube.com/watch?v=BKDEwpqADjo) | [скачать](chats/v129517728.ass) |
| 6 | [130208266](https://www.twitch.tv/videos/130208266) | [olgWLuZZoxA](https://www.youtube.com/watch?v=olgWLuZZoxA) | [скачать](chats/v130208266.ass) |
| 7 | [130640455](https://www.twitch.tv/videos/130640455) | [8aVBYHOL-JA](https://www.youtube.com/watch?v=8aVBYHOL-JA) | [скачать](chats/v130640455.ass) |
| 8 | [132460500](https://www.twitch.tv/videos/132460500) | [aski9zJE18M](https://www.youtube.com/watch?v=aski9zJE18M) | [скачать](chats/v132460500.ass) |
| 9 | [132722938](https://www.twitch.tv/videos/132722938) | [_rlCW6nrxRU](https://www.youtube.com/watch?v=_rlCW6nrxRU) | [скачать](chats/v132722938.ass) |
| 10 | [134698840](https://www.twitch.tv/videos/134698840) | [rEmWFgGTm2o](https://www.youtube.com/watch?v=rEmWFgGTm2o) | [скачать](chats/v134698840.ass) |
| 11 | [135336477](https://www.twitch.tv/videos/135336477) | [Wl6AUvcl4nQ](https://www.youtube.com/watch?v=Wl6AUvcl4nQ) | [скачать](chats/v135336477.ass) |
| 12 | [136443704](https://www.twitch.tv/videos/136443704) | [_otITp-qIc0](https://www.youtube.com/watch?v=_otITp-qIc0) | [скачать](chats/v136443704.ass) |
| 13 | [138884824](https://www.twitch.tv/videos/138884824) | [g44IUL6knpU](https://www.youtube.com/watch?v=g44IUL6knpU) | [скачать](chats/v138884824.ass) |

## Prey

| № | Twitch | YouTube | Субтитры |
| --- | --- | --- | --- |
| 1 | [140288888](https://www.twitch.tv/videos/140288888) | [Og2_fkJo8NY](https://www.youtube.com/watch?v=Og2_fkJo8NY) | [скачать](chats/v140288888.ass) |
| 2 | [140295699](https://www.twitch.tv/videos/140295699) | [x8lucgXcyfk](https://www.youtube.com/watch?v=x8lucgXcyfk) | [скачать](chats/v140295699.ass) |
| 3 | [140548655](https://www.twitch.tv/videos/140548655) | [vbAftlMvoB8](https://www.youtube.com/watch?v=vbAftlMvoB8) | [скачать](chats/v140548655.ass) |
| 4 | [141300323](https://www.twitch.tv/videos/141300323) | [u2jhKbGE7jY](https://www.youtube.com/watch?v=u2jhKbGE7jY) | [скачать](chats/v141300323.ass) |
| 5 | [141516144](https://www.twitch.tv/videos/141516144) | [qL_kIUCWWIY](https://www.youtube.com/watch?v=qL_kIUCWWIY) | [скачать](chats/v141516144.ass) |
| 6 | [142839507](https://www.twitch.tv/videos/142839507) | [xvSuZzQ9CpM](https://www.youtube.com/watch?v=xvSuZzQ9CpM) | [скачать](chats/v142839507.ass) |
