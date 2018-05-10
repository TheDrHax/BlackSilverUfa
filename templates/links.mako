<%!
  import datetime
  from templates.utils import (player_compatible, stream_hash, md5file,
                               stream_to_attrs, mpv_file, mpv_args)
  from templates.utils.timecodes import Timecode
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

<style>
.main-content {
  padding: 2rem;
  max-width: 72rem;
}

/* Enable caption button in player */
.plyr [data-plyr=captions] {
  display: inline-block !important;
}

.stream {
  max-width: calc(100vh / 9 * 16 - 10%);
}
</style>
</%block>

<%block name="content">
<%def name="timecode_link(id, t)">\
<a href="javascript:void(0)" onclick="document.getElementById('wrapper-${id}').seek(${int(t)})">${str(t)}</a>\
</%def>

<%def name="timecode_list(id, stream)">\
<%
  offset = Timecode(stream.get('offset'))
  timecodes = [(Timecode(t) - offset, name)
               for t, name in stream['timecodes'].items()
               if Timecode(t) >= offset]
%>\
% if len(timecodes) > 0:
  <li>Таймкоды:</li>
  <ul>
  % for t, name in timecodes:
    <li>${timecode_link(id, t)} - ${name}</li>
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

<%def name="gen_stream(id, stream)">
<% hash = stream_hash(stream) %>\
<h2 id="${hash}"><a id="${id}" href="#${hash}">${stream['name']}</a></h2>

<ul>
% if stream.get('note'):
  <li>Примечание: ${stream['note']}</li>
% endif
  <li>Ссылки:</li>
  <ul>
    <li>Twitch: <a href="https://www.twitch.tv/videos/${stream['twitch']}">${stream['twitch']}</a></li>
    <li>Субтитры: <a href="../chats/v${stream['twitch']}.ass">v${stream['twitch']}.ass</a></li>
    ${source_link(stream)}
  </ul>
% if stream.get('offset'):
  <li>Эта запись смещена на ${stream['offset']} от начала стрима</li>
% endif
% if stream.get('timecodes'):
  ${timecode_list(id, stream)}
% endif
% for i in ['start', 'soft_start']:
  % if stream.get(i):
  <li>Игра начинается с ${timecode_link(id, Timecode(stream[i]) - Timecode(stream.get('offset')))}</li>
  % endif
% endfor
% if stream.get('end'):
  <li>Запись заканчивается в ${timecode_link(id, Timecode(stream['end']) - Timecode(stream.get('offset')))}</li>
% endif
</ul>

<div class="row justify-content-md-center">
  <p class="stream col" id="wrapper-${id}" ${stream_to_attrs(stream)} />
</div>

% if not player_compatible(stream):
<p>Запись этого стрима в данный момент отсутствует. Если вы попали сюда по
прямой ссылке с YouTube, то это значит, что запись уже есть, но сайт ещё не
обновился. Обычно на это требуется минута или около того, но я оставляю
комментарий ещё до завершения процесса. Нажмите
<a onclick="document.location.reload()">сюда</a>, чтобы попробовать обновить
страницу.</p>
% endif

<h4>Команда для просмотра стрима в проигрывателе MPV</h4>

<%el:code_block>\
% if player_compatible(stream):
mpv ${mpv_args(stream)} ${mpv_file(stream)}
% else:
streamlink -p "mpv ${mpv_args(stream)}" --player-passthrough hls twitch.tv/videos/${stream['twitch']} best
% endif
</%el:code_block>

% if game['streams'].index(stream) != len(game['streams']) - 1:
<hr>
% endif
</%def>

<h1><a href="/">Архив</a> → ${game['name']}</h1>
<% id = 0 %> \
% for stream in game['streams']:
${gen_stream(id, stream)}
<% id += 1 %> \
% endfor
</%block>
