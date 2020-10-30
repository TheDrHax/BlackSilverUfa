const SEGMENT_HASH_REGEX = /^([0-9]+(\.[0-9]+|,)?)+$/;

class Redirect {
  static segments = null;

  static async init() {
    if (!Redirect.segments) {
      Redirect.segments = fetch('/data/segments.json').then((res) => {
        return res.json();
      }).then((segments) => {
        // Expand JoinedStreams onto their original segments
        Object.keys(segments).filter((key) => key.indexOf(',') !== -1).map((key) => {
          key.split(',').map((key_part) => {
            segments[key_part] = segments[key];
          });
        });

        return segments;
      });
    }

    return await Redirect.segments;
  }

  static isHash(hash) {
    return hash.match(SEGMENT_HASH_REGEX) !== null;
  }

  static parse_params(params) {
    let parsed_params = {};
    if (!params) return parsed_params;
    params.split('&').map((param) => {
      let [name, value] = param.split('=');
      parsed_params[name] = value;
    });
    return parsed_params;
  }

  static compile_params(parsed_params) {
    return Object.entries(parsed_params).map(([key, value]) => {
      return key + '=' + value;
    }).join('&');
  }

  static async parse(hash) {
    if (!hash) {
      return null;
    }

    let params;
    [hash, params] = hash.split('?');
    params = Redirect.parse_params(params);

    let parts = hash.split('/');
    let game, segment, timecode;

    if (!Redirect.isHash(parts[0])) {
      [game, segment, timecode] = parts;

      if (!segment) {
        return {
          game: game,
          segment: null,
          params: null
        };
      }
    } else {
      [segment, timecode] = parts;
    }

    // Legacy timecodes support
    if (timecode) {
      params['t'] = timecode;
    }

    // Strip .0 from segments
    if (segment.endsWith('.0')) {
      segment = segment.substr(0, segment.length - 2);
    }

    let segments = await Redirect.init();

    if (Object.keys(segments).indexOf(segment) === -1) {
      if (segment.indexOf(',') !== -1) { // Redirect from removed joined streams
        let joined_parts = segment.split(',');
        let found = false;

        for (let i = 0; i < joined_parts.length; i++) {
          let part = joined_parts[i];

          if (Object.keys(segments).indexOf(part) !== -1) {
            segment = part;
            found = true;
            break;
          }

          if (!found) {
            return null;
          }
        }
      } else {
        return null;
      }
    }

    let segment_data = segments[segment];

    if (segment && (!game || segment_data.games.indexOf(game) === -1)) {
      game = segment_data.games[0];
    }

    return {
      game: game,
      segment: segment,
      params: params
    };
  }

  static async link(raw_hash) {
    let hash = await Redirect.parse(raw_hash);

    if (!hash) {
      return '/';
    }

    let url = `/links/${hash.game}.html`;

    if (hash.segment) {
      url += `#${hash.segment}`;
    }

    if (hash.params && Object.keys(hash.params).length > 0) {
      url += '?';
      url += Redirect.compile_params(hash.params);
    }

    return url;
  }

  static async go(raw_hash) {
    let path = document.location.pathname + document.location.hash;
    let dest = await Redirect.link(raw_hash);

    if (path != dest) {
      window.location.replace(dest);
    }
  }

  static detect() {
    Redirect.go(window.location.search.substr(1));
  }
}

export { Redirect };
