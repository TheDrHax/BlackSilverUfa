<%inherit file="include/base.mako" />

<%block name="head">
<title>${config['title']}</title>
</%block>

<%block name="content">
<div id="app"></div>

<noscript>
  <div class="alert alert-danger" role="alert">
    <b>Ошибка:</b> Для работы сайта требуется JavaScript!
  </div>
</noscript>

<script src="/dist/bundle.js"></script>
</%block>
