import { Data } from './data';

const SEGMENT_HASH_REGEX = /^([0-9]+(\.[0-9]+|,)?)+$/;

class Redirect {
  static segments = null;

  static async init() {
    Redirect.segments = (await Data).segments;
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

  /**
   * Update parsed hash if its segment is missing or disabled
   */
  static check_hash(game, segment, params) {
    if (!segment ||
        typeof(segment) != "string" ||
        !segment.match(SEGMENT_HASH_REGEX)) {

      return null;
    }

    let segments = Redirect.segments;

    // Handle missing segments
    if (!segments.by('segment', segment)) {
      let found = false;

      if (segment.indexOf(',') !== -1) {
        // Redirect from removed joined streams
        let joined_parts = segment.split(',');

        for (let i = 0; i < joined_parts.length; i++) {
          let part = joined_parts[i];

          if (segments.by('segment', part)) {
            segment = part;
            found = true;
            break;
          }
        }
      } else if (segment.indexOf('.') !== -1) {
        // Redirect from removed segments to main segment
        let main_segment = segment.substr(0, segment.indexOf('.'));

        if (segments.by('segment', main_segment)) {
          segment = main_segment;
          found = true;
        }
      }

      if (!found) {
        return null;
      }
    }

    // Handle segments without references
    if (segments.by('segment', segment).games.length === 0) {
      let found = false;

      // Redirect to joined streams
      let candidates = segments.chain()
        .find({segment: {'$contains': ','}})
        .where((obj) => obj.segment.split(',').indexOf(segment) !== -1)
        .data().map((s) => s.segment);

      if (candidates.length > 0) {
        let old_segment = segment;

        segment = candidates[0];
        found = true;

        // Rebase timestamp
        if (params && params.at) {
          let segment_data = segments.by('segment', segment);
          let segment_index = segment.split(',').indexOf(old_segment);

          let t = +params.at;
          let offset = segment_data.offsets[segment_index];

          if (segment_data.cuts) {
            segment_data.cuts
              .filter(([start, end]) => end <= t + offset)
              .map(([start, end]) => {
                offset -= end - start;
              });
          }

          params.at = t + offset;
        }
      }

      if (!found) {
        return null;
      }
    }

    let segment_data = segments.by('segment', segment);
    if (!game || segment_data.games.indexOf(game) === -1) {
      game = segment_data.games[0];
    }

    return {
      game: game,
      segment: segment,
      params: params
    };
  }

  static parse(hash) {
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

    return Redirect.check_hash(game, segment, params);
  }

  static link(raw_hash) {
    let hash = Redirect.parse(raw_hash);

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

  static go(raw_hash) {
    let path = document.location.pathname + document.location.hash;
    let dest = Redirect.link(raw_hash);

    if (path != dest) {
      window.location.replace(dest);
    }
  }

  static detect() {
    Redirect.go(window.location.search.substr(1));
  }
}

export { Redirect };
