import React from 'react';
import { render } from 'react-dom';
import Matomo from './matomo';
import App from './components/router';

// Matomo
Matomo.trackPageView();

// Router
if (document.getElementById('react-main-root')) {
  render(<App />, document.getElementById('react-main-root'));
}
