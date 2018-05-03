# Архив стримов BlackUFA_Twitch [![Build Status](https://jenkins.thedrhax.pw/job/BlackSilverUfa/badge/icon)](https://jenkins.thedrhax.pw/job/BlackSilverUfa/)

Перейдите на [GitHub Pages](https://blackufa.thedrhax.pw) для доступа ко всем функциям ![](https://static-cdn.jtvnw.net/emoticons/v1/81274/1.0)

## Инструкции

После отказа от Markdown стало непонятно, куда девать эти документы. Да и устарели они немного. Пусть пока побудут здесь.

* [Как скачать чат в виде субтитров?](tutorials/subtitles.md)
* [Как посмотреть запись стрима с субтитрами?](tutorials/watch-online.md)

## Документация

* [Описание формата данных](data/README.md)

### Сборка и тестирование

Проект плотно интегрируется с Docker, поэтому для самой простой сборки нужно его установить. Остальное за вас сделает скрипт `./bsu`:

```bash
# Собрать образ со сборочным окружением (обязательно в первый раз)
./bsu image build

# Собрать сайт из исходного кода
./bsu build

# Поднять веб-сервер на порту 8000 и пересобирать сайт при изменении кода
./bsu serve
```
