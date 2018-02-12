<!DOCTYPE html>
<html lang="ru-RU">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#157878">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="/static/style.css">
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
      <%block name="content">
          Nothing here :O
      </%block>

      <footer class="site-footer">
        % if config.get('github'):
          <span class="site-footer-owner">
            Репозиторий
            <a href="https://github.com/${config['github']['user']}/${config['github']['repo']}/">
              ${config['github']['repo']}
            </a>
            поддерживается пользователем
            <a href="https://github.com/${config['github']['user']}/">
              ${config['github']['user']}
            </a>.
          </span>
        % endif
      </footer>
    </section>
  </body>
</html>
