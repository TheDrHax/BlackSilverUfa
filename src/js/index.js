import 'regenerator-runtime/runtime';
import '../css/styles.scss';

import React from 'react';
import { render } from 'react-dom';
import * as Sentry from '@sentry/react';
import App from './app';

Sentry.init({
  dsn: 'https://5763ba8387e642b690528a52adead2ef@o1176364.ingest.sentry.io/6274115',
  beforeSend(event) {
    if (!event.exception) return event;
    if (event.exception.values[0].mechanism.handled) return event;

    Sentry.showReportDialog({
      eventId: event.event_id,
      lang: 'ru',
      title: 'Похоже, что-то сломалось :(',
      user: {
        name: 'Попкоп Сладкорулетов',
        email: 'popcop@example.com',
      },
      subtitle: 'Ошибка будет исправлена в ближайшее время 👍',
      subtitle2: 'Вы можете помочь, рассказав о том, что произошло ❤️',
      labelName: 'Имя',
      labelEmail: 'Почта',
      labelComments: 'Текст',
      labelClose: 'Закрыть',
      labelSubmit: 'Отправить',
      errorGeneric: 'Не удалось отправить сообщение. Возможно, что сломался не только сайт 👀',
      errorFormEntry: 'Некоторые поля заполнены неправильно.',
      successMessage: 'Сообщение отправлено! Спасибо :)',
    });

    return event;
  },
});

render(<App />, document.getElementById('app'));
