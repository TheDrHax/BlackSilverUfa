import 'bootstrap.native/dist/bootstrap-native-v4';
import Darkmode from 'darkmode-js';
import Headroom from 'headroom.js';
import LazyLoad from 'vanilla-lazyload';
import { Search } from './search';
import { Redirect } from './redirect';
import './player';

var darkmode = new Darkmode({
  saveInCookies: true,
  label: '<i class="fas fa-lightbulb"></i>',
  autoMatchOsTheme: true
});
darkmode.showWidget();

// Workaround for https://github.com/sandoche/Darkmode.js/issues/7
document.querySelector('.darkmode-toggle').addEventListener('click', function (e) {
  this.style.pointerEvents = 'none';
  setTimeout(() => {
    this.style.pointerEvents = '';
  }, 500);
});

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

// Matomo
var _paq = _paq || [];
_paq.push(['enableHeartBeatTimer']);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function () {
  var u = "//matomo.thedrhax.pw/";
  _paq.push(['setTrackerUrl', u + 'piwik.php']);
  _paq.push(['setSiteId', '1']);
  var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
  g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = u + 'piwik.js'; s.parentNode.insertBefore(g, s);
})();

new LazyLoad({ elements_selector: '.lazyload' });

// Search
if (document.querySelector('#search')) {
  Search.init('#search');
}

// Redirect
window.Redirect = Redirect;
