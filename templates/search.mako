<%! from templates.data.games import Game, SegmentReference %>

var Redirect = {
  index: {
    % for segment in streams.segments:
    "${segment.hash}": "${segment.references[0].game.filename}#${segment.hash}",
    % endfor
  },

  link: function (hash) {
    let dest = this.index[hash];

    if (dest !== undefined) {
      return dest;
    } else {
      return "/";
    }
  },

  go: function (hash) {
    let path = document.location.pathname + document.location.hash;
    let redirect = this.link(hash);

    if (path != redirect) {
      window.location.replace(this.link(hash));
    }
  }
}

var Search = {
  categories: {
  % for category in categories:
    % if category.search != False:
    "${category.code}": "${category.name}",
    % endif
  % endfor
  },

  games: {
<% listed_games = [] %>\
  % for category in categories:
    % if category.search != False:
    "${category.code}": [
      % for game in reversed(category.games):
        % if type(game) == Game:
      { name: "${game.name}", path: "${game.filename}", year: ${game.date.year} },
        % elif type(game) == SegmentReference:
          % if game.game not in listed_games:
      { name: "${game.game.name}", path: "${game.game.filename}", year: ${game.date.year} },
<% listed_games.append(game.game) %>\
          % endif
          % for name in game.name.split(' / '):
      { name: "${name}", path: "${game.game.filename}#${game.hash}", year: ${game.date.year} },
          % endfor
        % endif
      % endfor
    ],
    % endif
  % endfor
  },

  data: function() {
    return Object.keys(Search.games).flatMap(function (category) {
      return Search.games[category].map(function (x) {
        x.group = Search.categories[category];
        return x;
      });
    });
  },

  init: function() {
    let data = Search.data();

    function strip(string) {
      return string.trim().toLowerCase().match(/[a-zа-я0-9]+/gi).join(' ');
    }

    autocomplete({
      minLength: 2,
      input: document.querySelector("#search"),
      fetch: function(text, update) {
        text = strip(text);
        let suggestions = data.filter(function (x) {
          if (text.indexOf(' ') != -1) {
            return strip(x.name).indexOf(text) != -1;
          } else {
            let words = strip(x.name).split(' ');
            return words.filter(y => y.startsWith(text)).length > 0;
          }
        });
        update(suggestions);
      },
      render: function(item, currentValue) {
        let div = document.createElement("div");
        div.innerHTML = item.name + ' - <span>' + item.year + '</span>';
        return div;
      },
      onSelect: function(item) {
        window.location = item.path;
      }
    });
  }
};
