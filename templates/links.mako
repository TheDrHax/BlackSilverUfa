<%inherit file="base.mako" />
<%namespace file="markdown.mako" name="md" />

<%block name="head">
<title>${game['name']} | ${config['title']}</title>
<!-- jQuery -->
<script src="//code.jquery.com/jquery-3.2.1.min.js"></script>
<!-- Plyr (https://github.com/sampotts/plyr) -->
<link rel="stylesheet" href="//cdn.plyr.io/2.0.18/plyr.css">
<script src="//cdn.plyr.io/2.0.18/plyr.js"></script>
<!-- Subtitles Octopus (https://github.com/Dador/JavascriptSubtitlesOctopus) -->
<script src="/static/js/subtitles-octopus.js"></script>

<style>
.main-content {
  padding: 2rem;
  max-width: 72rem;
}
</style>
</%block>

<%block name="content">
<%
  def sec(t):
    return sum(int(x) * 60 ** i for i,x in enumerate(reversed(t.split(":"))))

  def mpv_compatible(stream):
    for i in ['youtube', 'vk', 'direct', 'segments']:
       if i in stream:
           return True
    return False

  def mpv_file(stream):
    if stream.get('youtube'):
      return 'ytdl://' + stream['youtube']
    elif stream.get('vk'):
      return 'https://api.thedrhax.pw/vk/video/' + stream['vk'] + '\?redirect'
    elif stream.get('direct'):
      return stream['direct']
    elif stream.get('segments'):
      segments = [mpv_file(segment) for segment in stream['segments']]
      return '--merge-files ' + ' '.join(segments)

  def mpv_args(stream):
    result = '--sub-file=chats/v{}.ass '.format(stream['twitch'])

    if stream.get('subtitle_offset'):
      result += '--sub-delay=-{} '.format(sec(stream['subtitle_offset']))

    return result.strip()

%>

<%def name="timecode_link(id, timecode)"> \
<a onclick="player${id}.seek(${sec(timecode)})">${timecode}</a> \
</%def>

<%def name="source_link(stream, text=u'Запись')">\
% if stream.get('youtube'):
  <li>${text} (YouTube): <a href="https://www.youtube.com/watch?v=${stream['youtube']}">${stream['youtube']}</a></li>
% elif stream.get('vk'):
  <li>${text} (ВКонтакте): <a href="https://vk.com/video${stream['vk']}">${stream['vk']}</a></li>
% elif stream.get('direct'):
  <li>${text}: <a href="${stream['direct']}">прямая ссылка</a></li>
% elif stream.get('segments'):
  <li>Запись сегментирована:</li>
  <ul>
  % for segment in stream['segments']:
    ${source_link(segment, text=u'Часть {}'.format(stream['segments'].index(segment)+1))}
  % endfor
  </ul>
% else:
  <li>${text}: отсутствует</li>
% endif
</%def>

<%def name="player(id, stream, text=u'Открыть плеер')">
<p>
  <a onclick="return openPlayer${id}()" id="button-${id}">
    <b>▶ ${text}</b>
  </a>
</p>

<script>
  var player${id}, subs${id};

  function openPlayer${id}() {
    player${id} = plyr.setup('#player-${id}', {
      % if stream.get('end'):
      duration: ${sec(stream['end'])},
      % endif
    })[0];

    % if stream.get('end'):
    // Stop player when video exceeds overriden duration
    player${id}.on('timeupdate', function(event) {
      if (player${id}.getCurrentTime() >= player${id}.getDuration()) {
        player${id}.seek(player${id}.getDuration());
        player${id}.pause();
      }
    });
    % endif

    // Set video source
    player${id}.source({
      type: 'video',
      sources: [{
      % if stream.get('youtube'):
        type: 'youtube',
        src: "${stream['youtube']}"
      % elif stream.get('vk'):
        type: 'video/mp4',
        src: "https://api.thedrhax.pw/vk/video/${stream['vk']}?redirect"
      % elif stream.get('direct'):
        type: 'video/mp4',
        src: "${stream['direct']}"
      % endif
      }]
    });

    // Seek to specific position on first start of the video
    player${id}.on('ready', function(event) {
      % if stream.get('start'):
      player${id}.seek(${sec(stream['start'])});
      % endif
    });

    // Connect Subtitles Octopus to video
    subs${id} = new SubtitlesOctopus({
      video: player${id}.getMedia(),
      subUrl: "/chats/v${stream['twitch']}.ass",
      workerUrl: '/static/js/subtitles-octopus-worker.js',
      % if stream.get('subtitle_offset'):
      timeOffset: ${sec(stream['subtitle_offset'])}
      % endif
    });

    // Fix subtitles position on first start of the video
    player${id}.on('play', function(event) {
      subs${id}.resize();
    });

    % if stream.get('youtube'):
    // Fix Subtitles Octopus to work with embedded YouTube videos
    // TODO: Fix subtitles position in fullscreen mode
    function subResize(event) {
      var e_sub = subs${id}.canvas;
      var e_vid = player${id}.getMedia();

      e_sub.style.display = "block";
      e_sub.style.top = 0;
      e_sub.style.position = "absolute";
      e_sub.style.pointerEvents = "none";

      e_sub.width = e_vid.clientWidth;
      e_sub.height = e_vid.clientHeight;

      subs${id}.resize(e_sub.width, e_sub.height);
    }
    player${id}.on('ready', subResize);
    player${id}.on('enterfullscreen', subResize);
    player${id}.on('exitfullscreen', subResize);
    % endif

    document.getElementById("spoiler-${id}").click();
    document.getElementById("button-${id}").remove();

    return false;
  }
</script>

<details>
  <summary id="spoiler-${id}"></summary>

  <div class="player-wrapper" style="margin-top: 32px">
    <video id="player-${id}"></video>
  </div>
</details>

<script>
if (window.location.hash) {
  var id = window.location.hash.replace('#', '');
  if (id == "${id}" || id == "${stream['twitch']}")
    openPlayer${id}();
}
</script>
</%def>

<%def name="gen_stream(id, stream)">
<h2 id="${stream['twitch']}">
  <a id="${id}" href="#${stream['twitch']}">${stream['name']}</a>
</h2>

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
% if stream.get('timecodes'):
% if stream.get('segments'):
  <li>Таймкоды (работают только в пределах первой части, см. <a href="https://github.com/TheDrHax/BlackSilverUfa/issues/5">#5</a>)</li>
% else:
  <li>Таймкоды:</li>
% endif
  <ul>
  % for timecode in stream['timecodes']:
    <li>${timecode_link(id, timecode[0])} - ${timecode[1]}</li>
  % endfor
  </ul>
% endif
% if stream.get('start'):
  <li>Стрим начинается с ${timecode_link(id, stream['start'])}</li>
% endif
% if stream.get('end'):
  <li>Стрим заканчивается в ${timecode_link(id, stream['end'])}</li>
% endif
</ul>

% if stream.get('youtube') or stream.get('direct') or stream.get('vk'):
${player(id, stream)}
% elif stream.get('segments'):
% for segment in stream['segments']:
<%
  segment_index = stream['segments'].index(segment)
  segment_id = 100*(id+1) + segment_index
  segment['twitch'] = stream['twitch']
%> \
${player(segment_id, segment, text=u'Часть {}'.format(segment_index+1))}
% endfor
% endif

<h4>Команда для просмотра стрима в проигрывателе MPV</h4>

<%md:code_block>\
% if mpv_compatible(stream):
mpv ${mpv_args(stream)} ${mpv_file(stream)}
% else:
streamlink -p "mpv ${mpv_args(stream)}" --player-passthrough hls twitch.tv/videos/${stream['twitch']} best
% endif
</%md:code_block>

<hr>
</%def>

<h1><a href="/">Архив</a> → ${game['name']}</h1>
<% id = 0 %> \
% for stream in game['streams']:
${gen_stream(id, stream)}
<% id += 1 %> \
% endfor

<p>Приведённые команды нужно выполнить, находясь в корне ветки gh-pages данного Git репозитория и подготовив все нужные программы по <a href="../tutorials/watch-online.md">этой</a> инструкции.</p>

<p>Быстрый старт:</p>
<ul>
  <li><%md:code>git clone https://github.com/TheDrHax/BlackSilverUfa.git</%md:code></li>
  <li><%md:code>cd BlackSilverUfa</%md:code></li>
  <li><%md:code>git checkout gh-pages</%md:code></li>
  <li>Команда, приведённая выше</li>
</ul>
</%block>
