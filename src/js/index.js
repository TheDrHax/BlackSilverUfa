import 'regenerator-runtime/runtime';
import '../css/styles.scss';

import React from 'react';
import { render } from 'react-dom';
import * as Sentry from '@sentry/react';
import App from './app';

Sentry.init({
  dsn: 'https://6e2148b9be25473ca26324d7ff922fc7@app.glitchtip.com/11475',
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
