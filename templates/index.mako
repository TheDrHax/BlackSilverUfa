<%! from templates.utils import numword %>
<%inherit file="include/base.mako" />
<%namespace file="include/elements.mako" name="el" />
<%namespace file="include/statistics.mako" name="stats" />

<%block name="head">
<title>Главная страница | ${config['title']}</title>
</%block>

<%block name="content">
<p>Этот сайт содержит архив стримов и чата Twitch-канала <a href="https://www.twitch.tv/blackufa_twitch/">BlackUFA_Twitch</a>. Источником записей служат официальные каналы <a href="https://www.youtube.com/user/BlackSilverUFA">BlackSilverUFA</a> и <a href="https://www.youtube.com/user/BlackSilverChannel">BlackSilverChannel</a>. В редких случаях запись не попадает ни на один из этих каналов, поэтому в архив вносятся <a href="#vk">неофициальные записи из ВКонтакте</a>.</p>

<p>Чат сохраняется в формате субтитров ASS сразу после завершения трансляции при помощи модифицированного скрипта <a href="https://github.com/TheDrHax/Twitch-Chat-Downloader">Twitch-Chat-Downloader</a>. Все субтитры попадают в <a href="https://github.com/${config['github']['user']}/${config['github']['repo']}/tree/${config['github']['pages']}/chats">репозиторий на GitHub</a>, откуда их можно скачать и подключить к практически любому плееру.</p>

<p>Для просмотра стримов не нужно что-то скачивать или устанавливать: в сайт встроен HTML5-плеер <a href="https://github.com/sampotts/plyr">Plyr</a> и движок субтитров <a href="https://github.com/Dador/JavascriptSubtitlesOctopus">Subtitles Octopus</a>. Просто выберите серию стримов ниже и наслаждайтесь <img style="margin-bottom: -0.1em;" src="https://static-cdn.jtvnw.net/emoticons/v1/180344/1.0" /> :)</p>

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

  <div class="row">
  % if category.get('type') is None:
    % for game in sorted(category['games'], key=lambda k: k['name']):
    <div class="col-sm-6 col-md-4 col-lg-3 col-card">
      <div class="card h-100">
        <%el:game_link game="${game}">
        <img class="card-img-top" src="${game.streams[0].thumbnail()}" />
        <div class="card-img-overlay overlay-transparent-bottom bg-dark text-white">
            ${game['name']}
        </div>
        <div class="card-img-overlay card-badge">
          <span class="badge badge-primary">
            ${numword(len(game['streams']), 'стрим')}
          </span>
        </div>
        </%el:game_link>
      </div>
    </div>
    % endfor
  % elif category['type'] == 'list':
    % for stream in category['games'][0]['streams']:
    <div class="col-sm-6 col-md-4 col-lg-3 col-card">
      <div class="card h-100">
        <%el:stream_link game="${category['games'][0]}" stream="${stream}">
          <img class="card-img" src="${stream.thumbnail()}" />
          <div class="card-img-overlay overlay-transparent-bottom bg-dark text-white">
            ${stream['name']}
          </div>
        </%el:stream_link>
      </div>
    </div>
    % endfor
  % endif
  </div>

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
    % if not stream.player_compatible():
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
