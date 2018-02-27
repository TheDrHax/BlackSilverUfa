<%inherit file="base.mako" />

<%def name="header(level=1)">\
<h${level}>${caller.body()}</h${level}>\
</%def>

<%block name="head">
<title>Главная страница | ${config['title']}</title>
</%block>

<%block name="content">
<%
  def count_format(i):
      if i == 1:
          return u'{0} стрим'.format(i)
      elif i in [2, 3, 4]:
          return u'{0} стрима'.format(i)
      else:
          return u'{0} стримов'.format(i)
%>

<h1>Архив чата BlackUFA_Twitch</h1>

<p>
Этот сайт (и соответствующий ему репозиторий) содержит архив чата Twitch-канала
<a href="https://www.twitch.tv/blackufa_twitch/">BlackUFA_Twitch</a>. Чат хранится
в виде субтитров формата ASS, что позволяет накладывать сообщения поверх видео в
практически любом плеере.
</p>

<p>
Архив также содержит ссылки на постоянные записи с возможностью онлайн просмотра.
Встроенный плеер <a href="https://github.com/sampotts/plyr">Plyr</a> не только
поддерживает воспроизведение видео с YouTube и из других источников, но и
автоматически накладывает соответствующие субтитры с помощью очень быстрого движка
<a href="https://github.com/Dador/JavascriptSubtitlesOctopus">Subtitles Octopus</a>.
</p>

% for category in categories:
  ## Заголовок категории
  <%self:header level="${category['level']}">
    ${category['name']}
  </%self:header>

  ## Описание категории
  % if category.get('description'):
    <p>${category['description']}</p>
  % endif

  <ul>
  % if category.get('type') is None:
    % for game in category['games']:
    <li>
      <a href="links/${game['filename']}">
        ${game['name']}
      </a>
      (${count_format(len(game['streams']))})
    </li>
    % endfor
  % elif category['type'] == 'list':
    % for stream in category['games'][0]['streams']:
    <li>
      <a href="links/${category['games'][0]['filename']}#${stream['twitch']}">
        ${stream['name']}
      </a>
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
Поддерживаются любые видео с YouTube или из ВКонтакте. Сегментированные записи
работают частично, но я <a href="https://github.com/TheDrHax/BlackSilverUfa/issues/5">стараюсь</a>.
Спасибо!
</p>

<ul>
<%
  # TODO: Export this function into separate file
  def player_compatible(stream):
    for i in ['youtube', 'vk', 'direct']:
       if i in stream:
           return True
    return False

  missing = False
%>\
% for game in games:
  % for stream in game['streams']:
    % if not player_compatible(stream):
<% missing = True %>\
    <li>
      <a href="links/${game['filename']}">${game['name']}</a> -
      <a href="links/${game['filename']}#${stream['twitch']}">${stream['name']}</a>
    </li>
    % endif
  % endfor
% endfor
% if not missing:
<li>Все записи на месте. Отлично! :)</li>
% endif
</ul>

</%block>
