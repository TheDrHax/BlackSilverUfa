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

<%def name="game_link(game)">\
<% text = capture(caller.body) %>\
<a href="${game.filename}">\
${text if text else game.name}\
</a>\
</%def>

<%def name="stream_link(game, stream)">\
<% text = capture(caller.body) %>\
<a href="${game.filename}#${stream.hash}">\
${text if text else stream.name}\
</a>\
</%def>

<%def name="game_card(game)">\
<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2 col-card">
  <div class="card">
    <%self:game_link game="${game}">
      <noscript><img class="card-img-top" src="${game.thumbnail}" /></noscript>
      <img class="card-img-top lazyload" src="/static/images/no-preview.png" data-original="${game.thumbnail}" />
      <div class="card-img-overlay overlay-transparent-bottom bg-dark text-white">
        ${game.name}
      </div>
      <div class="card-img-overlay card-badge">
        <span class="badge badge-primary">
          ${numword(game.stream_count(), 'стрим')}
        </span>
      </div>
    </%self:game_link>
  </div>
</div>
</%def>

<%def name="segment_card(segment)">\
<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2 col-card">
  <div class="card">
    <%self:stream_link game="${segment.game}" stream="${segment}">
      <noscript><img class="card-img-top" src="${segment.thumbnail}" /></noscript>
      <img class="card-img lazyload" src="/static/images/no-preview.png" data-original="${segment.thumbnail}" />
      <div class="card-img-overlay overlay-transparent-bottom bg-dark text-white">
        ${segment.name}
      </div>
    </%self:stream_link>
  </div>
</div>
</%def>

<%def name="segment_grid(category)">\
<% year = None %>\
<div class="row d-none d-sm-flex">
  % for game in category.games:
    % if category.split_by_year != False and year is not None and year != game.date.year:
      <div class="col-12"><div class="hr-sect">↓ ${game.date.year} год ↓</div></div>
    % endif
<% year = game.date.year %>\
    % if type(game) == Game:
      <%self:game_card game="${game}" />
    % elif type(game) == SegmentReference:
      <%self:segment_card segment="${game}" />
    % endif
  % endfor
  </div>
</%def>

<%def name="segment_grid_xs(category)">\
<% year = None %>\
<ul class="list-group d-sm-none">
  % for game in category.games:
    % if category.split_by_year != False and year is not None and year != game.date.year:
      <div class="col-12"><div class="hr-sect">↓ ${game.date.year} год ↓</div></div>
    % endif
<% year = game.date.year %>\
    % if type(game) == Game:
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <%self:game_link game="${game}">
          ${game.name}
        </%self:game_link>
        <span class="badge badge-primary">
          ${numword(game.stream_count(), 'стрим')}
        </span>
      </li>
    % elif type(game) == SegmentReference:
      <li class="list-group-item">
        <%self:stream_link game="${game.game}" stream="${game}">
          ${game.name}
        </%self:stream_link>
      </li>
    % endif
  % endfor
</ul>
</%def>