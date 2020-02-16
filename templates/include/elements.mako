<%!
    from templates.utils import numword
    from templates.data.games import Game, SegmentReference
%>

<%def name="code()">
<code class="highlighter-rouge">${caller.body()}</code>
</%def>

<%def name="code_block()">
<div class="highlighter-rouge"><div class="highlight">
  <pre class="highlight"><code>${caller.body()}</code></pre>
</div></div>
</%def>

<%def name="header(level=1, id=None)">\
% if id:
<h${level} id="${id}">${caller.body()}</h${level}>\
% else:
<h${level}>${caller.body()}</h${level}>\
% endif
</%def>

<%def name="card(text, thumbnail, link, badge=None)">\
<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2 col-card"><div class="card"><a href="${link}">
  <noscript><img class="card-img-top" src="${thumbnail}" /></noscript>
  <img class="card-img-top lazyload" src="/static/images/no-preview.png" data-src="${thumbnail}" />
  <div class="card-img-overlay overlay-transparent-bottom bg-dark text-white">${text}</div>
% if badge:
  <div class="card-img-overlay card-badge"><span class="badge badge-primary">${badge}</span></div>
    % endif
</a></div></div>
</%def>

<%def name="segment_grid(category)">\
<% year = None %>\
<div class="row d-none d-sm-flex">
% for game in category.games:
  % if category.split_by_year and year is not None and year != game.date.year:
    <div class="col-12"><div class="hr-sect">↓ ${game.date.year} год ↓</div></div>
  % endif
<% year = game.date.year %>\
  % if type(game) == Game:
    <%self:card
      text="${game.name}"
      thumbnail="${game.thumbnail}"
      link="${game.filename}"
      badge="${numword(game.stream_count(), 'стрим')}" />
  % elif type(game) == SegmentReference:
    <%self:card
      text="${game.name}"
      thumbnail="${game.thumbnail}"
      link="${game.game.filename}#${game.hash}" />
  % endif
% endfor
</div>
</%def>

<%def name="segment_grid_xs(category)">\
<% year = None %>\
<ul class="list-group d-sm-none">
% for game in category.games:
  % if category.split_by_year and year is not None and year != game.date.year:
    <div class="col-12"><div class="hr-sect">↓ ${game.date.year} год ↓</div></div>
  % endif
<% year = game.date.year %>\
  % if type(game) == Game:
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <a href="${game.filename}">${game.name}</a>
      <span class="badge badge-primary">${numword(game.stream_count(), 'стрим')}}</span>
    </li>
  % elif type(game) == SegmentReference:
    <li class="list-group-item"><a href="${game.game.filename}#${game.hash}">${game.name}</a></li>
  % endif
% endfor
</ul>
</%def>