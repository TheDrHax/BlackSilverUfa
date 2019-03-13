<%! from templates.utils import numword %>
<%inherit file="include/base.mako" />
<%namespace file="include/elements.mako" name="el" />
<%namespace file="include/statistics.mako" name="stats" />

<%block name="head">
<title>Стримы без официальных записей | ${config['title']}</title>
</%block>

<%block name="content">
<%
    vk = []
    yt = []
    missing = []

    for game in games:
        for stream in game['streams']:
            if 'vk' in stream:
                vk.append((game, stream))
            elif 'youtube' in stream:
                if stream.get('official') == False:
                    yt.append((game, stream))
            else:
                missing.append((game, stream))
%>\

<h2>Стримы без официальных записей</h2>

% if len(missing) > 0:
  <p>Записи этих стримов пока ещё не были загружены ни на один из поддерживаемых видеохостингов.</p>

  <ul>
  % for game, stream in missing:
    <li>
      <%el:game_link game="${game}" /> —\
      <%el:stream_link game="${game}" stream="${stream}" />
    </li>
  % endfor
% else:
  <p>Все записи на месте. Отлично! :)</p>
% endif
</ul>

<h3 id="youtube">Записи на YouTube</h3>

% if len(yt) > 0:
  <p>Эти стримы были перезалиты на сторонние каналы YouTube. Обычно Артур не противодействует этому, так как у видео всё равно снимается монетизация. Главное требование — поддерживать порядок в комментариях.</p>

  <ul>
  % for game, stream in yt:
    <li>
      <%el:game_link game="${game}" /> —\
        <%el:stream_link game="${game}" stream="${stream}" />
    </li>
  % endfor
  </ul>
% else:
  <p>Если вы видите эту надпись, то на YouTube нет ни одной неофициальной записи. Надеюсь, что все записи стали официальными, а не вот это вот. Вооот.</p>
% endif

<h3 id="vk">Записи из ВКонтакте</h3>

% if len(vk) > 0:
  <p>Перечисленные ниже стримы используют ВКонтакте как источник видео. Mail.Ru активно <a href="https://vk.com/blacksilverufa?w=wall140277504_139931">ставит палки в колёса</a> тем, кто не хочет смотреть видео у них на сайте, поэтому эти записи могут работать нестабильно.</p>

  <ul>
  % for game, stream in vk:
    <li>
      <%el:game_link game="${game}" /> —\
      <%el:stream_link game="${game}" stream="${stream}" />
    </li>
  % endfor
  </ul>
% else:
  <p>В данный момент ВКонтакте не используется в качестве источника записей (все записи есть на YouTube). И это хорошо, так как Mail.Ru активно <a href="https://vk.com/blacksilverufa?w=wall140277504_139931">ставит палки в колёса</a> тем, кто не хочет смотреть видео у них на сайте.</p>
% endif

</%block>
