<%! from templates.utils import numword %>
<%inherit file="include/base.mako" />
<%namespace file="include/elements.mako" name="el" />
<%namespace file="include/statistics.mako" name="stats" />

<%block name="head">
<title>Стримы без официальных записей | ${config['title']}</title>
</%block>

<%block name="content">
<h2>Стримы без официальных записей</h2>

<p>Если у вас есть ссылка на запись любого из этих стримов, сообщите мне через раздел <a href="https://github.com/TheDrHax/BlackSilverUfa/issues/">Issues</a> этого репозитория. Поддерживаются любые видео с YouTube или из ВКонтакте. Спасибо!</p>

<ul>
<% missing = False %>\
% for game in games:
  % for stream in game['streams']:
    % if not stream.player_compatible():
<% missing = True %>\
    <li>
      <%el:game_link game="${game}" /> —\
      <%el:stream_link game="${game}" stream="${stream}" />
    </li>
    % endif
  % endfor
% endfor
% if not missing:
<li>Все записи на месте. Отлично! :)</li>
% endif
</ul>

<h3 id="vk">Записи из ВКонтакте</h3>

<p>Перечисленные ниже стримы используют ВКонтакте как источник видео. Mail.Ru активно <a href="https://vk.com/blacksilverufa?w=wall140277504_139931">ставит палки в колёса</a> тем, кто не хочет смотреть видео у них на сайте, поэтому эти записи могут работать нестабильно.</p>

<ul>
% for game in games:
  % for stream in game['streams']:
    % if 'vk' in stream:
    <li>
      <%el:game_link game="${game}" /> —\
      <%el:stream_link game="${game}" stream="${stream}" />
    </li>
    % endif
  % endfor
% endfor
</ul>

<h3 id="youtube">Записи на YouTube</h3>

<p>Эти стримы были перезалиты на сторонние каналы YouTube. Обычно Артур не противодействует этому, так как у видео всё равно снимается монетизация. Главное требование — поддерживать порядок в комментариях.</p>

<ul>
% for game in games:
  % for stream in game['streams']:
    % if 'youtube' in stream and stream.get('official') == False:
    <li>
      <%el:game_link game="${game}" /> —\
      <%el:stream_link game="${game}" stream="${stream}" />
    </li>
    % endif
  % endfor
% endfor
</ul>

</%block>
