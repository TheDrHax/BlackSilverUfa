<%inherit file="include/base.mako" />

<%block name="head">
<title>Перенаправление | ${config['title']}</title>
</%block>

<%block name="content">
<div class="d-flex justify-content-center">
  <a href="/" id="link">
    <button type="button" class="btn btn-secondary">
      Нажмите сюда, если перенаправление не сработало
    </button>
  </a>
</div>
</%block>

<%block name="scripts">
<script>
  Redirect.detect();
</script>
</%block>
