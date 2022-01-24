import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../css/styles.scss';

import React from 'react';
import { render } from 'react-dom';
import App from './app';

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app'),
);
