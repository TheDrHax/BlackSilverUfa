import autocomplete from 'autocompleter';
import { Data } from './data';
import { Redirect } from './redirect';

class Search {
  static games = null;

  static strip(string) {
    return string.trim().split(' ').map((word) => {
      let match = word.toLowerCase().match(/[a-zа-я0-9]+/g);
      return match ? match.join('') : '';
    }).join(' ');
  }

  static async load() {
    Search.games = await Data.games;
  }

  static async init(selector) {
    await Promise.all([Search.load(), Redirect.init()]);

    return autocomplete({
      minLength: 2,
      input: document.querySelector(selector),
      fetch: (text, update) => {
        let parsed_hash = Redirect.check_hash(null, text);
        
        if (parsed_hash) {
          let segment = Redirect.segments[parsed_hash.segment];

          let segments = [];
          segments.push({
            name: segment.name,
            group: 'Переход по ID',
            id: parsed_hash.segment
          });

          if (parsed_hash.segment.indexOf('.') === -1) {
            for (let i = 1;; i++) {
              let hash = parsed_hash.segment + '.' + i;
              segment = Redirect.segments[hash];
              if (segment) {
                segments.push({
                  name: segment.name,
                  group: 'Переход по ID',
                  id: hash
                });
              } else {
                break;
              }
            }
          }

          update(segments);
          return;
        }

        text = Search.strip(text);
        
        let suggestions = Search.games.filter((x) => {
          if (text.indexOf(' ') != -1) {
            return Search.strip(x.name).indexOf(text) != -1;
          } else {
            let words = Search.strip(x.name).split(' ');
            return words.filter(y => y.startsWith(text)).length > 0;
          }
        });

        update(suggestions);
      },
      render: (item, currentValue) => {
        let div = document.createElement("div");
        let html = item.name;
        if (item.year) { html += ' - <span>' + item.year + '</span>'; }
        div.innerHTML = html;
        return div;
      },
      onSelect: (item) => {
        Redirect.go(item.id);
      }
    });
  }
}

export { Search };
