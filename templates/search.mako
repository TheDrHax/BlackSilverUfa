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
  data: {
<% listed_games = [] %>\
    % for category in categories:
    "${category.code}": [
      % for game in category.games:
        % if type(game) == Game:
      {name: "${game.name}", path: "${game.filename}", year: ${game.date.year}},
        % elif type(game) == SegmentReference:
          % if game.game not in listed_games:
      {name: "${game.game.name}", path: "${game.game.filename}", year: ${game.date.year}},
<% listed_games.append(game.game) %>\
          % endif
      {name: "${game.name}", path: "${game.game.filename}#${game.hash}", year: ${game.date.year}},
        % endif
      % endfor
    ],
    % endfor
  },

  categories: [
    % for category in categories:
    {header: "${category.name}", listLocation: "${category.code}"},
    % endfor
  ],

  init: function() {
    let search = $("#search");

    search.easyAutocomplete({
      data: this.data,
      categories: this.categories,
      getValue: function(element) {
        return element.name;
      },
      list: {
        maxNumberOfElements: 8,
        match: { enabled: true },
        sort: { enabled: true },
        onChooseEvent: function(arg) {
            var item = search.getSelectedItemData();
            window.location = item.path;
        }
      },
      template: {
        type: "description",
        fields: {
          description: "year"
        }
      }
    });
  }
};
