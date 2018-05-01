<%! from templates.utils import player_compatible, numword %>
<%inherit file="include/base.mako" />
<%namespace file="include/elements.mako" name="el" />
<%namespace file="include/statistics.mako" name="stats" />

<%block name="head">
<title>Главная страница | ${config['title']}</title>
</%block>

<%block name="content">
<p>
Этот сайт содержит архив стримов и чата Twitch-канала
<a href="https://www.twitch.tv/blackufa_twitch/">BlackUFA_Twitch</a>.
Источником записей служат официальные каналы
<a href="https://www.youtube.com/user/BlackSilverUFA">BlackSilverUFA</a> и
<a href="https://www.youtube.com/user/BlackSilverChannel">BlackSilverChannel</a>.
В редких случаях запись не попадает ни на один из этих каналов,
поэтому в архив вносятся <a href="#vk">неофициальные записи из ВКонтакте</a>.
</p>

<p>
Чат сохраняется в формате субтитров ASS сразу после завершения трансляции при
помощи модифицированного скрипта
<a href="https://github.com/TheDrHax/Twitch-Chat-Downloader">Twitch-Chat-Downloader</a>.
Все субтитры попадают в репозиторий на GitHub, откуда их можно скачать и подключить
к практически любому плееру.
</p>

<p>
Для просмотра стримов не нужно что-то скачивать или устанавливать: в сайт встроен
HTML5-плеер <a href="https://github.com/sampotts/plyr">Plyr</a> и движок субтитров
<a href="https://github.com/Dador/JavascriptSubtitlesOctopus">Subtitles Octopus</a>.
Просто выберите серию стримов ниже и наслаждайтесь
<img style="margin-bottom: -0.4em;" src="https://static-cdn.jtvnw.net/emoticons/v1/180344/1.0" /> :)
</p>

<%stats:statistics />

% for category in categories:
  ## Заголовок категории
  <%el:header level="${category['level']}">
    ${category['name']}
  </%el:header>

  ## Описание категории
  % if category.get('description'):
    <p>${category['description']}</p>
  % endif

  <ul>
  % if category.get('type') is None:
    % for game in sorted(category['games'], key=lambda k: k['name']):
    <li>
      <%el:game_link game="${game}" /> (${numword(len(game['streams']), 'стрим')})
    </li>
    % endfor
  % elif category['type'] == 'list':
    % for stream in category['games'][0]['streams']:
    <li>
      <%el:stream_link game="${category['games'][0]}" stream="${stream}" />
    </li>
    % endfor
  % endif
  </ul>

% endfor

<hr>

<h2>Стримы без записей</h2>

<p>
Если у вас есть ссылка на запись любого из этих стримов, сообщите мне через раздел
<a href="https://github.com/TheDrHax/BlackSilverUfa/issues/">Issues</a> этого репозитория.
Поддерживаются любые видео с YouTube или из ВКонтакте. Спасибо!
</p>

<ul>
<% missing = False %>\
% for game in games:
  % for stream in game['streams']:
    % if not player_compatible(stream):
<% missing = True %>\
    <li>
      <%el:game_link game="${game}" /> —\
      <%el:stream_link game="${game}" stream="${stream}" />
    </li>
    % endif
  % endfor
% endfor
% if not missing:
<li>Все записи на месте. Отлично! :)</li>
% endif
</ul>

<h3 id="vk">Записи из ВКонтакте</h3>

<p>
Перечисленные ниже стримы используют ВКонтакте как источник видео. Mail.Ru активно
<a href="https://vk.com/blacksilverufa?w=wall140277504_139931">ставит палки в колёса</a>
тем, кто не хочет смотреть видео у них на сайте, поэтому эти записи могут работать нестабильно.
</p>

<ul>
% for game in games:
  % for stream in game['streams']:
    % if 'vk' in stream:
    <li>
      <%el:game_link game="${game}" /> —\
      <%el:stream_link game="${game}" stream="${stream}" />
    </li>
    % endif
  % endfor
% endfor
</ul>

</%block>
