import 'regenerator-runtime/runtime';
import '../css/styles.scss';

import React from 'react';
import { render } from 'react-dom';
import * as Sentry from '@sentry/react';
import App from './app';

Sentry.init({
  dsn: 'https://5763ba8387e642b690528a52adead2ef@o1176364.ingest.sentry.io/6274115',
});

render(<App />, document.getElementById('app'));
