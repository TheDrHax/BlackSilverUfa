# Архив стримов BlackUFA [![Build Status](https://jenkins.thedrhax.pw/job/BlackSilverUfa/badge/icon)](https://jenkins.thedrhax.pw/job/BlackSilverUfa/)

Перейдите на [GitHub Pages](https://blackufa.thedrhax.pw) для доступа ко всем функциям ![](https://static-cdn.jtvnw.net/emoticons/v1/81274/1.0)

## Документация

* [Описание формата данных](data/README.md)

### Зависимости

* [Python 3.6+](https://www.python.org/)
* [Git](https://git-scm.com/)
* tzdata (для корректной сборки в Alpine Linux)

### Сборка и тестирование

Основную часть работы выполняет shell-скрипт [bsu](./bsu) в корне репозитория. К сожалению, автоматическая сборка на Windows в данный момент не поддерживается, но проект можно собрать вручную при наличии Python.

При первом запуске скрипт создаст виртуальное окружение Python в директории `./_python` и установит туда все пакеты, неоходимые для сборки и запуска проекта (они перечислены в файле [requirements.txt](./requirements.txt)).

Ниже приведены примеры использования скрипта `./bsu`.

```bash
# Обновить виртуальное окружение Python
./bsu venv update

# Загрузить текущую версию ветки gh-pages в директорию ./_site
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
