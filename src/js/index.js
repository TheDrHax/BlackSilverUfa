import 'bootstrap.native/dist/bootstrap-native-v4';
import Darkmode from 'darkmode-js';
import Headroom from 'headroom.js';
import LazyLoad from 'vanilla-lazyload';
import React from 'react';
import { render } from 'react-dom';
import { Search } from './search';
import { Redirect } from './redirect';
import { Matomo } from './matomo';
import InteractiveSearch from './components/interactive-search';
import './player';

var darkmode = new Darkmode({
  saveInCookies: true,
  label: '<i class="fas fa-lightbulb"></i>',
  autoMatchOsTheme: true
});
darkmode.showWidget();

var headroom = new Headroom(document.querySelector('nav'), {
  onPin: function () {
    darkmode.button.hidden = false;

    if (!darkmode.isActivated()) {
      darkmode.layer.hidden = false;
    }
  },
  onUnpin: function () {
    darkmode.button.hidden = true;

    if (!darkmode.isActivated()) {
      darkmode.layer.hidden = true;
    }
  }
});
headroom.init();

new LazyLoad({ elements_selector: '.lazyload' });

// Matomo
Matomo.trackPageView();

// Search
if (document.querySelector('#search')) {
  Search.init('#search');
}

// Redirect
window.Redirect = Redirect;

if (document.getElementById('react-main-root')) {
  render(<InteractiveSearch />, document.getElementById('react-main-root'));
}