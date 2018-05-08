<!DOCTYPE html>
<html lang="ru-RU">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#157878">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.12/css/all.css" integrity="sha384-G0fIWCsCzJIMAVNQPfjH08cyYaUtMwjJwqiRKxxE/rx96Uroj1BtIQ6MLJuheaO9" crossorigin="anonymous">
    <link rel="stylesheet" href="/static/css/cayman.css">
    <link rel="stylesheet" href="/static/css/styles.css">
    <%block name="head" />
    <!-- Matomo -->
    <script type="text/javascript">
      var _paq = _paq || [];
      /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
      _paq.push(['enableHeartBeatTimer']);
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
        var u="//matomo.thedrhax.pw/";
        _paq.push(['setTrackerUrl', u+'piwik.php']);
        _paq.push(['setSiteId', '1']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
      })();
    </script>
    <!-- End Matomo Code -->
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <div class="mx-auto">
            <a class="navbar-brand mx-auto" href="/">${config['title']}</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="https://github.com/${config['github']['user']}/${config['github']['repo']}/"><i class="fab fa-github"></i> GitHub</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container main-content">
      <%block name="content" />

      <footer class="site-footer">
        <span class="site-footer-owner">
          Репозиторий
          <a href="https://github.com/${config['github']['user']}/${config['github']['repo']}/">
            ${config['github']['repo']}
          </a>
          поддерживается силами
          <a href="https://github.com/${config['github']['user']}/">
            ${config['github']['user']}
          </a>.
        </span>
        <span class="site-footer-credits">
          Весь контент принадлежит <a href="https://www.youtube.com/user/BlackSilverUfa">Артуру Блэку</a>.<br>
          Распространение ссылок на Архив под записями на YouTube было одобрено в <a href="/static/images/answer.jpg">комментарии</a>.<br>
          На сайте используется аналитика <a href="https://matomo.org/">Matomo</a>. Нажмите <a href="//matomo.thedrhax.pw/index.php?module=CoreAdminHome&action=optOut&language=ru">сюда</a>, чтобы отказаться от отслеживания.
        </span>
      </footer>
    </div>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script>
  </body>
</html>
