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
      console.log('Query variable %s not found', variable);
  }

  var url;
  switch(Number(getQueryVariable('s'))) {
    % for game in games:
      % for stream in game['streams']:
    case ${stream['twitch']}:
      url = "/links/${game['filename'].replace('md', 'html')}#${game['streams'].index(stream)}";
      break;
      % endfor
    % endfor
  }

  window.location.replace(url)
  document.getElementById('link').setAttribute("href", url)
</script>
