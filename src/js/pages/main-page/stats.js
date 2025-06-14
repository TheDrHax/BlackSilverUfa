import React, { useEffect, useState } from 'react';
import { Row, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { renderTemplate } from '../../utils/text-utils';
import { ftime } from '../../utils/time-utils';
import PATHS from '../../constants/urls';

const render = (t, n) => (
  <b>{n} {renderTemplate(t, { n })}</b>
);

export const StatsBlock = () => {
  const [data, setData] = useState();

  useEffect(() => {
    fetch('/data/stats.json')
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(() => {});
  }, []);

  if (!data) {
    return null;
  }

  const videoCoverage = Math.round(100 * (data.durations.segments / data.durations.streams));
  const avgMsgCount = Math.floor(data.counts.messages / data.counts.streams.with_chats);

  return (
    <Row>
      <p>
        В данный момент в архиве находится {render('стрим{n#,а,ов}', data.counts.streams.total)},
        разбитых на {render('сегмент{n#,а,ов}', data.counts.segments.total)}. Продолжительность
        всех сохранённых стримов примерно равна <b>{ftime(data.durations.streams)}</b>, а всех
        записей - <b>{ftime(data.durations.segments)}</b> (покрытие: <b>{videoCoverage}%</b>).
        За это время было написано {render('сообщен{n#ие,ия,ий}', data.counts.messages)} в чате,
        то есть в среднем по {render('сообщен{n#ию,ия,ий}', avgMsgCount)} за стрим.{' '}
        На <b>{render('сегмент{n#,а,ов}', data.content_id.streams)}</b> суммарно поступило{' '}
        <b>{render('заяв{n#ка,ки,ок}', data.content_id.count)}</b> Content ID, приводящих к{' '}
        блокировке во всём мире или только в России. Общая продолжительность заявок равна{' '}
        <b>{ftime(data.content_id.total)}</b>, что составляет лишь <b>{data.content_id.percentage}%</b>{' '}
        от заблокированного контента.{' '}

        {data.counts.segments.missing > 0 && (
          <>
            У {render('сегмент{n#а,ов,ов}', data.counts.segments.missing)} в данный момент
            {' '}
            <Link to={`${PATHS.SEARCH}?source=direct`}>нет постоянной записи</Link>.
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
