<%!
  import datetime
  from templates.utils import md5file
  from templates.data.timecodes import Timecode
%>
<%inherit file="include/base.mako" />
<%namespace file="include/elements.mako" name="el" />

<%block name="head">
<title>${game['name']} | ${config['title']}</title>

<!-- Plyr (https://github.com/sampotts/plyr) -->
<link rel="stylesheet" href="//cdn.plyr.io/2.0.18/plyr.css">
<script src="//cdn.plyr.io/2.0.18/plyr.js"></script>
<!-- Subtitles Octopus (https://github.com/Dador/JavascriptSubtitlesOctopus) -->
<script src="/static/js/subtitles-octopus.js"></script>
<script src="/static/js/player.js?hash=${md5file('static/js/player.js')}"></script>
</%block>

<%block name="content">
<%def name="timecode_link(id, t)">\
<a href="javascript:void(0)" onclick="document.getElementById('wrapper-${id}').seek(${int(t)})">${str(t)}</a>\
</%def>

<%def name="timecode_list(id, timecodes, offset=Timecode(0), text='Таймкоды')">\
% if timecodes >= offset:
  <li>${text}:</li>
  <ul>
  % for t, name in timecodes:
    % if type(t) is type(timecodes):
    ${timecode_list(id, t, offset=offset, text=name)}
    % elif t >= offset:
    <li>${timecode_link(id, t - offset)} - ${name}</li>
    % endif
  % endfor
  </ul>
% endif
</%def>

<%def name="source_link(stream, text=u'Запись')">\
% if stream.get('youtube'):
  <li>${text} (YouTube): <a href="https://www.youtube.com/watch?v=${stream['youtube']}">${stream['youtube']}</a></li>
% elif stream.get('vk'):
  <li>${text} (ВКонтакте): <a href="https://vk.com/video${stream['vk']}">${stream['vk']}</a></li>
% elif stream.get('direct'):
  <li>${text}: <a href="${stream['direct']}">прямая ссылка</a></li>
% endif
</%def>

<%def name="gen_segment(id, segment)">
<% hash = segment.hash %>\
<h2 id="${hash}"><a onclick="window.location.hash = '#${hash}'; return false;" href="/r/?${hash}">${segment['name']}</a></h2>

<ul>
% if segment.get('official') == False:
  <li>Официальная запись не была загружена на YouTube.</li>
% endif
% if segment.get('note'):
  <li>Примечание: ${segment['note']}</li>
% endif
  <li>Ссылки:</li>
  <ul>
    <li>Twitch: <a href="https://www.twitch.tv/videos/${segment['twitch']}">${segment['twitch']}</a></li>
    <li>Субтитры: <a href="../chats/v${segment['twitch']}.ass">v${segment['twitch']}.ass</a></li>
    ${source_link(segment)}
  </ul>
% if segment.get('offset'):
  <li>Эта запись смещена на ${segment['offset']} от начала стрима</li>
% endif
% if len(segment.stream.games) > 1:
  <li>Связанные игры:</li>
  <ul>
    % for game_ref, segment_ref in segment.stream.games:
      % if segment_ref is not segment and game_ref is not game:
    <li><%el:game_link game="${game_ref}" /> — \
        <%el:stream_link game="${game_ref}" stream="${segment_ref}" /></li>
      % endif
    % endfor
  </ul>
% endif
% if segment.get('timecodes'):
  ${timecode_list(id, segment['timecodes'], offset=Timecode(segment.get('offset')))}
% endif
% for i in ['start', 'soft_start']:
  % if segment.get(i):
  <li>Игра начинается с ${timecode_link(id, Timecode(segment[i]) - Timecode(segment.get('offset')))}</li>
  % endif
% endfor
% if segment.get('end'):
  <li>Запись заканчивается в ${timecode_link(id, Timecode(segment['end']) - Timecode(segment.get('offset')))}</li>
% endif
</ul>

<div class="row justify-content-md-center">
  <p class="stream col" id="wrapper-${id}" ${segment.attrs()} />
</div>

% if not segment.player_compatible():
<p>Запись этого стрима в данный момент отсутствует. Если вы попали сюда по
прямой ссылке с YouTube, то это значит, что запись уже есть, но сайт ещё не
обновился. Обычно на это требуется минута или около того, но я оставляю
комментарий ещё до завершения процесса. Нажмите
<a href="#" onclick="document.location.reload(); return false;">сюда</a>, чтобы попробовать обновить
страницу.</p>
% endif

<h4>Команда для просмотра стрима в проигрывателе MPV</h4>

<%el:code_block>\
% if segment.player_compatible():
mpv ${segment.mpv_args()} ${segment.mpv_file()}
% else:
streamlink -p "mpv ${segment.mpv_args()}" --player-passthrough hls twitch.tv/videos/${segment['twitch']} best
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
