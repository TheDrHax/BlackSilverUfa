const SEGMENT_HASH_REGEX = /^[0-9]+(\.[0-9]+)?$/;

class Redirect {
  static segments = null;

  static async init() {
    if (!Redirect.segments) {
      Redirect.segments = fetch('/data/segments.json').then((res) => {
        return res.json();
      });
    }

    return await Redirect.segments;
  }

  static isHash(hash) {
    return hash.match(SEGMENT_HASH_REGEX) !== null;
  }

  static async link(hash) {
    if (!hash || hash.length == 0) {
      return '/';
    }

    if (!Redirect.isHash(hash)) { // Assume ID of a game
      return '/links/' + hash + '.html';
    }

    let segments = await Redirect.init();

    if (segments[hash]) {
      return segments[hash].url;
    } else {
      return '/';
    }
  }

  static async go(hash) {
    let path = document.location.pathname + document.location.hash;
    let dest = await Redirect.link(hash);

    if (path != dest) {
      window.location.replace(dest);
    }
  }

  static detect() {
    let hash = window.location.search.substring(1);

    if (Redirect.isHash(hash) && hash.endsWith('.0')) {
      hash = hash.split('.')[0];
    }

    Redirect.go(hash);
  }
}

export { Redirect };
