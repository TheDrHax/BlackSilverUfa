import React from 'react';
import { render } from 'react-dom';
import App from './app';

// Router
if (document.getElementById('react-main-root')) {
  render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('react-main-root'),
  );
}
