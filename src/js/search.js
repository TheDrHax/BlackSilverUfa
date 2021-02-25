import autocomplete from 'autocompleter';
import { Data } from './data';
import { Redirect } from './redirect';

function tokenize(string) {
  return string.trim().split(' ').map((word) => {
    let match = word.toLowerCase().match(/[a-zа-я0-9]+/g);
    return match ? match.join('') : '';
  });
}

function fts(query, items, lambda) {
  query = tokenize(query);

  let max_rank = 0;

  return items.map((item) => {
    let words = tokenize(lambda(item));

    let rank = query.map((query_word) => {
      return words.filter((word) => word.startsWith(query_word)).length > 0;
    }).reduce((a, b) => a + b);

    if (rank > max_rank) {
      max_rank = rank;
    }

    return { item, rank };
  })
  .filter((item) => item.rank == max_rank && item.rank > 0)
  .map((item) => item.item);
}

class Search {
  static games = null;

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
          let segment = Redirect.segments.by('segment', parsed_hash.segment);

          let segments = [];
          segments.push({
            name: segment.name,
            group: 'Переход по ID',
            id: parsed_hash.segment
          });

          if (parsed_hash.segment.indexOf('.') === -1) {
            for (let i = 1;; i++) {
              let hash = parsed_hash.segment + '.' + i;
              segment = Redirect.segments.by('segment', hash);
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

        let suggestions = Search.games
          .chain()
          .where((item) => item.category.search !== false)
          .simplesort('category.$loki')
          .data();

        suggestions = fts(text, suggestions, (item) => item.name);

        update(suggestions.map((item) => {
          let segment = Redirect.segments.by('segment', item.segment);

          return {
            ...item,
            year: segment.date.getFullYear(),
            group: item.category.name
          };
        }));
      },
      render: (item, currentValue) => {
        let div = document.createElement("div");
        let html = item.name;
        if (item.year) { html += ' - <span>' + item.year + '</span>'; }
        div.innerHTML = html;
        return div;
      },
      onSelect: (item) => {
        if (item.type === 'segment') {
          Redirect.go(item.segment);
        } else {
          Redirect.go(item.id);
        }
      }
    });
  }
}

export { tokenize, fts, Search };
