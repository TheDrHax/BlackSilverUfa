<!DOCTYPE html>
<html lang="ru-RU">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#157878">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="/static/style.css">
    <%block name="head" />
  </head>
  <body>
    <section class="page-header">
      <h1 class="project-name">${config['title']}</h1>
      % if config.get('description'):
        <h2 class="project-tagline">${config['description']}</h2>
      % endif
      % if config.get('github'):
        <a href="https://github.com/${config['github']['user']}/${config['github']['repo']}/" class="btn">
          Исходный код на GitHub
        </a>
      % endif
    </section>

    <section class="main-content">
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
          Распространение ссылок на Архив под записями на YouTube было одобрено в <a href="/static/images/answer.jpg">комментарии</a>.
        </span>
      </footer>
    </section>
  </body>
</html>
