#!/bin/sh

# Склоняем слово "стрим" в зависимости от числа
# Ох уж этот русский язык :P
count_format() {
    case $1 in
        1) echo "$1 стрим";;
        2|3|4) echo "$1 стрима";;
        *) echo "$1 стримов";;
    esac
}

# Ищем все списки по определённым тегам
# Теги указываются во второй строке файла .list
add_by_tag() {
    find links -type f | while read name; do
        if grep -Eq "^$1$" "$name"; then
            TITLE=$(head -n1 "$name")
            FILE=$(echo "$name" | sed 's/\.list/.md/g')
            COUNT=$(grep -E '(--)' "$name" | wc -l)
            COUNT_FORMAT=$(count_format $COUNT)
            echo "* [$TITLE]($FILE) ($COUNT_FORMAT)"
        fi
    done
}

cat >README.md <<EOF
# Архив чата BlackUFA_Twitch

В этот репозиторий будет выборочно помещаться история соообщений из чата на определённых стримах в формате субтитров ASS. Поддерживаются цвета ников, а также смайлы (!) с расширением [Global Twitch Emotes](https://chrome.google.com/webstore/detail/global-twitch-emotes/pgniedifoejifjkndekolimjeclnokkb?utm_source=chrome-app-launcher-info-dialog).

## Инструкции

* [Как скачать чат в виде субтитров?](tutorials/subtitles.md)
* [Как посмотреть запись стрима с субтитрами?](tutorials/watch-online.md)

## Архив

### Завершённые прохождения

$(add_by_tag finished)

#### Ожидается продолжение

Одна сюжетная кампания завершена и ожидается другая, либо ожидается выход следующего сюжетного DLC.

$(add_by_tag to_be_continued)

#### [$(head -n1 links/single.list)](links/single.md)

`
LINES=$(grep -nE '(--)' links/single.list | sed 's/:.*//g')
for i in $LINES; do
    echo -n "* "
    sed -n $((i+1))p links/single.list
done
`

### В процессе

$(add_by_tag ongoing)

#### Потенциально бесконечные

$(add_by_tag infinite)

#### Под вопросом

$(add_by_tag questionable)

#### Незавершённые

Прохождения, вероятность продолжения которых КРАЙНЕ мала.

$(add_by_tag abandoned)

### Другое

$(add_by_tag other)

EOF
