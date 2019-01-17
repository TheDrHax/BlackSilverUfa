# Архив стримов BlackUFA [![Build Status](https://jenkins.thedrhax.pw/job/BlackSilverUfa/badge/icon)](https://jenkins.thedrhax.pw/job/BlackSilverUfa/)

Перейдите на [GitHub Pages](https://blackufa.thedrhax.pw) для доступа ко всем функциям ![](https://static-cdn.jtvnw.net/emoticons/v1/81274/1.0)

## Документация

* [Описание формата данных](data/README.md)

### Сборка и тестирование

Проект плотно интегрируется с Docker и Git, поэтому для самой простой сборки нужно их установить. Остальное за вас сделает скрипт `./bsu`:

```bash
# Собрать образ со сборочным окружением (обязательно в первый раз)
./bsu image build

# Загрузить текущую версия ветки gh-pages в директорию ./_site
# (нужно для тестирования субтитров и просмотра статистики)
./bsu pages checkout

# Собрать сайт из исходного кода
./bsu build
# или поднять веб-сервер на порту 8000
# (будет пересобирать сайт автоматически при изменении кода)
./bsu serve

# Загрузить недостающие субтитры (если они ещё доступны)
./bsu download-chats

# Закоммитить новую версию статики в локальную ветку gh-pages
./bsu pages commit

# Отправить изменения на GitHub
./bsu pages push
```
