<%!
  import os
  from templates.utils import numword, last_line, dir_size
  from templates.data.timecodes import Timecode
%>

<%def name="statistics()">\
<%
    sum_length = sum([stream.length for stream in streams.values()], Timecode(0))
    messages = sum([stream.messages for stream in streams.values()])
    dir = int(dir_size(_('chats')) / 1024**2)

    missing, unofficial = 0, 0
    for stream in streams.values():
        for segment in stream:
            if not segment.player_compatible():
                missing += 1
            if 'vk' in segment:
                unofficial += 1
            if 'youtube' in segment and segment.get('official') == False:
                unofficial += 1
%>\
<p>В данный момент в архиве находятся <b>${numword(len(streams), 'стрим')}</b> \
и <b>${dir} МБ</b> субтитров к ним. Общая продолжительность всех сохранённых \
стримов примерно равна <b>${sum_length}</b>. За это время было написано \
<b>${numword(messages, 'сообщение')}</b>, то есть в среднем по \
<b>${numword(messages // len(streams), 'сообщение')}</b> за стрим. \
% if missing > 0:
У <b>${numword(missing, 'стрима')}</b> в данный момент <a href="/missing.html">нет записи</a>.\
% endif
</p>

<div class="progress">
<%
  good = (len(streams) - missing - unofficial) / len(streams) * 100
  ok = (unofficial / len(streams) * 100)
  bad = (missing / len(streams) * 100)
%>\
  <div class="progress-bar bg-success" role="progressbar" style="width: ${good}%">Официальные записи</div>
  <div class="progress-bar bg-warning" role="progressbar" style="width: ${ok}%"><a href="/missing.html">Неофициальные записи</a></div>
  <div class="progress-bar bg-danger" role="progressbar" style="width: ${bad}%"></div>
</div>
</%def>
