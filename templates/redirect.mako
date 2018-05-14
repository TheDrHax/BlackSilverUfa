<%! from templates.data.timecodes import Timecode %>\
<%
    stream_map = {}

    for game in games:
        for stream in game['streams']:
            hash = stream.hash

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
  var hash = getQueryVariable('s') || window.location.search.substring(1);
  if (hash.split('.').length > 1 && hash.split('.')[1] == 0) {
    hash = hash.split('.')[0];
  }
  switch(hash) {
    % for hash, (game, stream) in stream_map.items():
    case "${hash}": url = "/links/${game['filename']}#${hash}"; break;
    % endfor
    default: url = '/'; break;
  }

  window.location.replace(url);
  document.getElementById('link').setAttribute("href", url);
</script>
</body></html>
