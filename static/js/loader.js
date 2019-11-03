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

var lazyload = new LazyLoad({
  elements_selector: '.lazyload'
});

function jsLoad(src, onload, uncached) {
  var script = document.createElement('script');
  if (uncached) {
    script.src = src + '?ts=' + Math.floor(Date.now() / 1000);
  } else {
    script.src = src;
  }
  script.onload = onload;
  document.body.appendChild(script);
}

jsLoad('/search.js', function() {
  Search.init('#search');
}, true);