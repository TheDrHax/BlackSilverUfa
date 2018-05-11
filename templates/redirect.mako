<%!
    from templates.utils import stream_hash
    from templates.utils.timecodes import Timecode
%>\
<%
    stream_map = {}

    for game in games:
        for stream in game['streams']:
            hash = stream_hash(stream)

            if hash in stream_map:
                s1 = Timecode(stream.get('start'))
                s2 = Timecode(stream_map[hash][1].get('start'))

                if s1 < s2:
                    stream_map[hash] = (game, stream)
            else:
                stream_map[hash] = (game, stream)

%>\
<html><head><title>Перенаправление</title><meta charset="UTF-8"></head><body>
<a href="/" id="link">Нажмите сюда, если перенаправление не сработало</a>
<script type="application/javascript">
  function getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) == variable) {
              return decodeURIComponent(pair[1]);
          }
      }
  }

  var url;
  switch(getQueryVariable('s') || window.location.search.substring(1)) {
    % for hash, (game, stream) in stream_map.items():
    case "${hash}": url = "/links/${game['filename']}#${hash}"; break;
      % if 'segment' in stream and stream['segment'] == 0:
    case "${stream['twitch']}": url = "/links/${game['filename']}#${hash}"; break;
      % endif
    % endfor
    default: url = '/'; break;
  }

  window.location.replace(url);
  document.getElementById('link').setAttribute("href", url);
</script>
</body></html>
