# Как скачать чат в виде субтитров?

Пока что это немного сложно, но, надеюсь, получится упростить этот процесс в будущем. ![](https://static-cdn.jtvnw.net/emoticons/v1/180319/1.0)

## Подготовка (нужно выполнить всего один раз)

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

## Скачивание чата

Нам понадобится заполучить ссылку на запись стрима на Twitch. Например, такую: `https://www.twitch.tv/videos/126330909`. Берём из неё номер видео и подставляем в следующую команду:

```bash
python Twitch-Chat-Downloader/app.py -v НОМЕР
```

Ждём несколько минут и наслаждаемся новыми субтитрами `chats/vНОМЕР.ass`! ![](https://static-cdn.jtvnw.net/emoticons/v1/180325/1.0)
