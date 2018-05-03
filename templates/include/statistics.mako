<%!
  import os
  from templates.utils import numword
  from templates.utils.timecodes import Timecode
%>

<%def name="statistics()">\
<%
    def dir_size(dir):
        if not os.path.isdir(dir):
            return 0

        return sum(os.path.getsize(dir + '/' + f)
                   for f in os.listdir(dir)
                   if os.path.isfile(dir + '/' + f))

    # https://stackoverflow.com/a/18603065
    def last_line(fp):
        with open(fp, 'rb') as f:
            f.seek(-2, os.SEEK_END)
            while f.read(1) != b"\n":
                f.seek(-2, os.SEEK_CUR)
            return f.readline().decode('utf-8')

    def stream_length(stream_id):
        if not os.path.isfile('chats/v{}.ass'):
            return Timecode(0)

        line = last_line('chats/v{}.ass'.format(stream_id))
        return Timecode(line.split(' ')[2].split('.')[0])

    # https://stackoverflow.com/a/1019572
    def count_lines(fp):
        if not os.path.isfile(fp):
            return 0

        with open(fp, 'r') as f:
            return sum(1 for line in f)

    total_length = Timecode(sum([int(stream_length(stream))
                            for stream in streams.keys()]))
    messages = sum([count_lines('chats/v{}.ass'.format(stream))
                    for stream in streams.keys()])
%>\
<p>\
В данный момент в архиве находятся <b>${numword(len(streams), 'стрим')}</b> и
<b>${int(dir_size('chats') / 1024**2)} МБ</b> субтитров к ним. Общая продолжительность
всех сохранённых стримов примерно равна <b>${total_length}</b>. За это время было
написано <b>${numword(messages, 'сообщение')}</b>, то есть в среднем по
<b>${numword(messages // len(streams), 'сообщение')}</b> за стрим.
</p>\
</%def>
