<%
  def count_format(i):
      if i == 1:
          return u'{0} стрим'.format(i)
      elif i in [2, 3, 4]:
          return u'{0} стрима'.format(i)
      else:
          return u'{0} стримов'.format(i)
%>

${'#'} Архив чата BlackUFA_Twitch

В этот репозиторий будет выборочно помещаться история соообщений из чата на
определённых стримах в формате субтитров ASS. Поддерживаются цвета ников, а
также смайлы (!) с расширением Global Twitch Emotes
([Chrome](https://chrome.google.com/webstore/detail/global-twitch-emotes/pgniedifoejifjkndekolimjeclnokkb),
[Firefox](https://addons.mozilla.org/en-US/firefox/addon/globaltwitchemotes/)).

${'##'} Инструкции

* [Как скачать чат в виде субтитров?](tutorials/subtitles.md)
* [Как посмотреть запись стрима с субтитрами?](tutorials/watch-online.md)

${'##'} Архив

% for category in categories:
  ## Заголовок категории
${'#'*category['level']} ${category['name']}

  ## Содержимое категории
  % if category.get('description'):
${category['description']}
  % endif
  % if category.get('type') is None:
    % for game in category['games']:
* [${game['name']}](links/${game['filename']}) (${count_format(len(game['streams']))})
    % endfor
  % elif category['type'] == 'list':
    % for stream in category['games'][0]['streams']:
* [${stream['name']}](links/${category['games'][0]['filename']}#${stream['twitch']})
    % endfor
  % endif

% endfor

----

${'###'} Стримы без записей

Если у вас есть ссылка на запись любого из этих стримов, сообщите мне через раздел
[Issues](https://github.com/TheDrHax/BlackSilverUfa/issues/) этого репозитория.
Поддерживаются любые не сегментированные видео с YouTube или из ВКонтакте. Спасибо!

<% missing = False %>\
% for game in games:
  % for stream in game['streams']:
    % if not stream.get('youtube') and not stream.get('direct') and not stream.get('vk') and not stream.get('segments'):
<% missing = True %>\
* [${game['name']}](links/${game['filename']}) - \
[${stream['name']}](links/${game['filename']}#${stream['twitch']})
    % endif
  % endfor
% endfor
% if not missing:
* Все записи на месте. Отлично! :)
% endif
