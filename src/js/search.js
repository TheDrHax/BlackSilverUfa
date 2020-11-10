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
        let parsed_hash = Redirect.check_hash(text);
        
        if (parsed_hash) {
          let segment = Redirect.segments[parsed_hash.segment];

          update([{
            name: segment.name,
            group: 'Переход по ID',
            id: parsed_hash.segment
          }]);
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
