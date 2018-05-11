<%! from templates.utils import stream_hash %>
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
    % for game in games:
      % for stream in game['streams']:
        % if 'segment' in stream and stream['segment'] == 0:
    case "${stream['twitch']}": url = "/links/${game['filename']}#${stream_hash(stream)}"; break;
        % endif
    case "${stream_hash(stream)}": url = "/links/${game['filename']}#${stream_hash(stream)}"; break;
      % endfor
    % endfor
    default: url = '/'; break;
  }

  window.location.replace(url);
  document.getElementById('link').setAttribute("href", url);
</script>
</body></html>
