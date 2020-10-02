import autocomplete from 'autocompleter';
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
    if (!Search.games) {
      Search.games = fetch('/data/categories.json').then((res) => {
        return res.json();
      }).then((categories) => {
        // Create flat array of games and add category name to each of them
        let games = Object.keys(categories).flatMap((key) => {
          let category = categories[key];

          if (category.search === false) {
            return [];
          }

          return category.games.flatMap((game) => {
            game.group = category.name;

            let names = game.name.split(' / ');

            if (names.length > 1) {
              return names.map((name) => {
                let subref = Object.assign({}, game);
                subref.name = name;
                return subref;
              });
            } else {
              return game;
            }
          });
        });

        return games;
      });
    }

    return await Search.games;
  }

  static async init(selector) {
    let games = await Search.load();
    let segments = await Redirect.init();
    let segment_ids = Object.keys(segments);

    return autocomplete({
      minLength: 2,
      input: document.querySelector(selector),
      fetch: (text, update) => {
        text = Search.strip(text);

        if (segment_ids.indexOf(text) !== -1) {
          update(segment_ids.filter((key) => key.startsWith(text)).map((key) => {
            let segment = segments[key];
            return {
              name: segment.name,
              group: 'Переход по ID',
              id: key
            };
          }));
          return;
        }

        let suggestions = games.filter((x) => {
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
