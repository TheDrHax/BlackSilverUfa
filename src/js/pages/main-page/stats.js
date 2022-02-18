import React, { useEffect, useState } from 'react';
import { Row, ProgressBar } from 'react-bootstrap';
import { renderTemplate } from '../../utils/text-utils';
import { ftime } from '../../utils/time-utils';

const render = (t, n) => (
  <b>{n} {renderTemplate(t, { n })}</b>
);

export const StatsBlock = () => {
  const [data, setData] = useState();

  useEffect(() => {
    fetch('/data/stats.json')
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  if (!data) {
    return null;
  }

  const videoCoverage = Math.round(100 * (data.durations.segments / data.durations.streams));
  const avgMsgCount = Math.floor(data.counts.messages / data.counts.streams.with_chats);

  // TODO: Добавить в поиск фильтр по источнику записи
  // Чтобы можно было сделать "нет записи" и "Неофициальные записи" ссылками
  return (
    <Row>
      <p>
        В данный момент в архиве находится {render('стрим{n#,а,ов}', data.counts.streams.total)},
        разбитых на {render('сегмент{n#,а,ов}', data.counts.segments.total)}. Продолжительность
        всех сохранённых стримов примерно равна <b>{ftime(data.durations.streams)}</b>, а всех
        записей - <b>{ftime(data.durations.segments)}</b> (покрытие: <b>{videoCoverage}%</b>).
        За это время было написано {render('сообщен{n#ие,ия,ий}', data.counts.messages)} в чате,
        то есть в среднем по {render('сообщен{n#ию,ия,ий}', avgMsgCount)} за стрим.{' '}

        {data.counts.segments.missing > 0 && (
          <>
            У {render('сегмент{n#а,ов,ов}', data.counts.segments.missing)} в данный момент нет записи.
          </>
        )}
      </p>

      <div>
        <ProgressBar>
          <ProgressBar
            label="Официальные записи"
            variant="success"
            now={data.counts.segments.official}
            max={data.counts.segments.total}
          />
          <ProgressBar
            label="Неофициальные записи"
            variant="warning"
            now={data.counts.segments.unofficial}
            max={data.counts.segments.total}
          />
          <ProgressBar
            variant="danger"
            now={data.counts.segments.missing}
            max={data.counts.segments.total}
          />
        </ProgressBar>
      </div>
    </Row>
  );
};
