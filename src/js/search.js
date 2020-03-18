import autocomplete from 'autocompleter';
import { Redirect } from './redirect';

class Search {
  static games = null;

  static strip(string) {
    return string.trim().toLowerCase().match(/[a-zа-я0-9\.]+/gi).join(' ');
  }

  static async load() {
    if (Search.games != null) return Search.games;

    return fetch('/data/categories.json').then((res) => {
      return res.json();
    }).then((categories) => {
      // Create flat array of games and add category name to each of them
      Search.games = Object.keys(categories).flatMap((key) => {
        let category = categories[key];
        return category.games.map((game) => {
          game.group = category.name;
          return game;
        });
      });

      return Search.games;
    });
  }

  static async init(selector) {
    let games = await Search.load();

    await Redirect.init();
    let segments = Object.keys(Redirect.segments);

    return autocomplete({
      minLength: 2,
      input: document.querySelector(selector),
      fetch: (text, update) => {
        text = Search.strip(text);

        if (segments.indexOf(text) !== -1) {
          update(segments.filter((key) => key.startsWith(text)).map((key) => {
            let segment = Redirect.segments[key];
            return {
              name: segment.name,
              group: 'Переход по ID',
              url: segment.url
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
        window.location = item.url;
      }
    });
  }
}

export { Search };
