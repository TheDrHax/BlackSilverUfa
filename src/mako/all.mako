<%!
  from src.utils import numword
  from src.data.games import Game, SegmentReference
%>
<%inherit file="include/base.mako" />
<%namespace file="include/elements.mako" name="el" />

<%block name="head">
<title>Все игры | ${config['title']}</title>
</%block>

<%block name="content">
% for category in categories.values():
  ## Заголовок категории
  <%el:header level="${category.level}" id="${category.code}">
    ${category.name}
  </%el:header>

  ## Описание категории
  % if category.description:
    <p>${category.description}</p>
  % endif

  <%el:segment_grid category="${category}" />
  <%el:segment_grid_xs category="${category}" />
% endfor
</%block>
