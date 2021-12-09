<%!
    import os
    from src.utils import numword, last_line
    from src.data.streams import StreamType
    from src.data.timecodes import T
    from src.config import config
%>

<%def name="statistics()">\
<%
    duration_streams, duration_segments = T, T
    streams_total = 0
    chats_total = 0
    messages = 0

    for stream in streams.values():
        if stream.type is StreamType.JOINED:
            continue

        if stream.type is not StreamType.NO_CHAT:
            chats_total += 1
        
        streams_total += 1

        duration_streams += stream.duration
        messages += stream.messages

        for segment in stream:
            duration_segments += segment.duration

    subs_dirs = list(key.replace('$PREFIX/', '')
                     for key in config['repos']['mounts'].keys()
                     if key.startswith('$PREFIX/chats'))

    official, unofficial, missing = 0, 0, 0
    for segment in streams.segments:
        if len(segment.references) == 0:
            continue

        if segment.youtube:
            if not segment.official:
                unofficial += 1
            else:
                official += 1
        else:
            missing += 1

    all_segments = official + unofficial + missing
%>\
<p>В данный момент в архиве находятся <b>${numword(streams_total, 'стрим')}</b>, \
разбитые на <b>${numword(all_segments, 'сегмент')}</b>. Продолжительность всех сохранённых стримов примерно равна \
<b>${duration_streams}</b>, а всех записей — <b>${duration_segments}</b>. \
За это время было написано <b>${numword(messages, 'сообщение')}</b>, то есть в среднем по \
<b>${numword(messages // chats_total, 'сообщение')}</b> за стрим. \
% if missing > 0:
У <b>${numword(missing, 'сегмента')}</b> в данный момент <a href="/missing.html">нет записи</a>.\
% endif
</p>

<div class="progress">
<%
    good = official / all_segments * 100
    ok = unofficial / all_segments * 100
    bad = missing / all_segments * 100
%>\
  <div class="progress-bar bg-success" role="progressbar" style="width: ${good}%">Официальные записи</div>
  <div class="progress-bar bg-warning" role="progressbar" style="width: ${ok}%"><a href="/missing.html">Неофициальные записи</a></div>
  <div class="progress-bar bg-danger" role="progressbar" style="width: ${bad}%"></div>
</div>
</%def>
