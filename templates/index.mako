<%!
  from templates.utils import numword
  from templates.data.games import Game, SegmentReference
%>
<%inherit file="include/base.mako" />
<%namespace file="include/elements.mako" name="el" />
<%namespace file="include/statistics.mako" name="stats" />

<%block name="head">
<title>Главная страница | ${config['title']}</title>
</%block>

<%block name="content">
<p>Этот сайт содержит архив стримов и чата Twitch-канала <a href="https://www.twitch.tv/blackufa/">BlackUFA</a>. Источником записей служат официальные каналы <a href="https://www.youtube.com/user/BlackSilverUFA">BlackSilverUFA</a> и <a href="https://www.youtube.com/user/BlackSilverChannel">BlackSilverChannel</a>. В редких случаях запись не попадает ни на один из этих каналов, поэтому в архив вносятся неофициальные записи с <a href="/missing.html#youtube">YouTube</a> или из <a href="/missing.html#vk">ВКонтакте</a>.</p>

<p>Чат сохраняется в формате субтитров ASS сразу после завершения трансляции при помощи скрипта <a href="https://github.com/TheDrHax/Twitch-Chat-Downloader">Twitch-Chat-Downloader</a>. Все субтитры попадают в <a href="https://github.com/${config['github']['user']}/${config['github']['repo']}/tree/${config['github']['pages']}/chats">репозиторий на GitHub</a>, откуда их можно скачать и подключить к практически любому плееру.</p>

<p>Для просмотра стримов не нужно что-то скачивать или устанавливать: в сайт встроен HTML5-плеер <a href="https://github.com/sampotts/plyr">Plyr</a> и движок субтитров <a href="https://github.com/Dador/JavascriptSubtitlesOctopus">Subtitles Octopus</a>. Просто выберите серию стримов ниже и наслаждайтесь <img style="margin-bottom: -0.1em;" src="https://static-cdn.jtvnw.net/emoticons/v1/180344/1.0" /> :)</p>

<%stats:statistics />

% for category in categories:
  ## Заголовок категории
  <%el:header level="${category.level}" id="${category.code}">
    ${category.name}
  </%el:header>

  ## Описание категории
  % if category.description:
    <p>${category.description}</p>
  % endif

  <%el:segment_grid category="${category}" />
  <%el:segment_grid_xs category="${category}" />
% endfor
</%block>
