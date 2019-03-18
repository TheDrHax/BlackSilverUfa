<%!
  import datetime
  from babel.dates import format_date
  from templates.utils import md5file
  from templates.data.timecodes import Timecode, Timecodes
%>
<%inherit file="include/base.mako" />
<%namespace file="include/elements.mako" name="el" />

<%block name="head">
<title>${game['name']} | ${config['title']}</title>
</%block>

<%block name="scripts">
<!-- Plyr (https://github.com/sampotts/plyr) -->
<link rel="stylesheet" href="//cdn.plyr.io/3.4.7/plyr.css">
<script src="//cdn.plyr.io/3.4.7/plyr.js" crossorigin="anonymous"></script>
<!-- Subtitles Octopus (https://github.com/Dador/JavascriptSubtitlesOctopus) -->
<script src="/static/js/subtitles-octopus.js"></script>
<script src="/static/js/player.js?hash=${md5file('static/js/player.js')}"></script>
</%block>

<%block name="content">
<%def name="timecode_link(id, t)">\
% if t.duration:
<%
    duration = t.duration
    t = Timecode(t)
    t.duration = None
%>\
${timecode_link(id, t)} - ${timecode_link(id, t + duration)}\
% else:
<a href="javascript:void(0)" class="timecode" data-id="${id}" data-value="${int(t)}">${str(t)}</a>\
% endif
</%def>

<%def name="timecode_list(id, timecodes, text='Таймкоды')">\
% if len(timecodes) > 0:
  <li>${text}:</li>
  <ul>
  % for t in timecodes:
    % if isinstance(t, Timecodes) and not t.is_list:
    ${timecode_list(id, t, text=t.name)}
    % elif isinstance(t, Timecodes) and t.is_list:
    <li>
      % for i, t1 in enumerate(t):
      ${timecode_link(id, t1)}${',' if i != len(t) - 1 else ''}
      % endfor
      — ${t.name}
    </li>
    % else:
    <li>${timecode_link(id, t)} — ${t.name}</li>
    % endif
  % endfor
  </ul>
% endif
</%def>

<%def name="gen_segment(id, segment)">
<% hash = segment.hash %>\
<div class="d-flex" style="flex-wrap: wrap;">
  <div class="">
    <h2 id="${hash}">
      <a onclick="window.location.hash = '#${hash}'; return false;" href="/r/?${hash}">${segment['name']}</a>
    </h2>
  </div>
  <div class="badge-row">
    <span class="badge badge-light">
      ${format_date(segment.date, format='long', locale='ru')}
    </span>
    <span class="badge badge-primary">
      <a href="https://www.twitch.tv/videos/${segment['twitch']}" target="_blank">
        <i class="fab fa-twitch"></i> ${segment['twitch']}
      </a>
    </span>
    <span class="badge badge-secondary">
      <a href="../chats/v${segment['twitch']}.ass">
        <i class="far fa-closed-captioning"></i> Субтитры
      </a>
    </span>
    % if segment.get('youtube'):
    <span class="badge badge-${'warning' if segment.get('official') == False else 'success'}">
      <a href="https://www.youtube.com/watch?v=${segment['youtube']}" target="_blank">
        <i class="fab fa-youtube"></i> ${segment['youtube']}
      </a>
    % elif segment.get('vk'):
    <span class="badge badge-danger">
      <a href="https://vk.com/video${segment['vk']}" target="_blank">
        <i class="fab fa-vk"></i> ${segment['vk']}
      </a>
    % elif segment.get('direct'):
    <span class="badge badge-danger">
      <a href="${segment['direct']}" target="_blank">
        <i class="fas fa-download"></i> прямая ссылка
      </a>
    % endif
    </span>
  </div>
</div>

<ul>
% if segment.get('note'):
  <li>Примечание: ${segment['note']}</li>
% endif
<% related = [(g, s) for g, s in segment.stream.games
                     if g is not game or game.get('type') == 'list'] %>\
% if len(related) > 0:
  <li>Связанные игры:</li>
  <ul>
    % for game_ref, segment_ref in related:
    <li><%el:game_link game="${game_ref}" /> — <%el:stream_link game="${game_ref}" stream="${segment_ref}" /></li>
    % endfor
  </ul>
% endif
% if segment.get('timecodes'):
  ${timecode_list(id, segment['timecodes'])}
% endif
</ul>

<div class="row justify-content-center">
  <p class="stream col" data-id="${id}" ${segment.attrs()} />
</div>

% if not segment.player_compatible():
<p>Запись этого стрима в данный момент отсутствует. Если вы попали сюда по
прямой ссылке с YouTube, то это значит, что запись уже есть, но сайт ещё не
обновился. Обычно на это требуется минута или около того, но я оставляю
комментарий ещё до завершения процесса. Нажмите
<a href="#" onclick="document.location.reload(); return false;">сюда</a>, чтобы попробовать обновить
страницу.</p>
% endif

<%el:code_block>\
% if segment.player_compatible():
mpv ${segment.mpv_args()} ${segment.mpv_file()}
% endif
% if not segment.player_compatible() or segment.get('direct'):
streamlink -p mpv -a "${segment.mpv_args()}" --player-passthrough hls twitch.tv/videos/${segment['twitch']} best
% endif
</%el:code_block>

% if game['streams'].index(segment) != len(game['streams']) - 1:
<hr>
% endif
</%def>

<h1><a href="/">Архив</a> → ${game['name']}</h1>
<% id = 0 %> \
% for segment in game['streams']:
${gen_segment(id, segment)}
<% id += 1 %> \
% endfor
</%block>
