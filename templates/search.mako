<%!
  from templates.data.timecodes import Timecode
  from templates.data.games import Game, SegmentReference
%>\
<%
    stream_map = {}

    for game in games:
        for stream in game['streams']:
            hash = stream.hash

            if hash in stream_map:
                s1 = Timecode(stream.get('start'))
                s2 = Timecode(stream_map[hash][1].get('start'))

                if s1 < s2:
                    stream_map[hash] = (game, stream)
            else:
                stream_map[hash] = (game, stream)
%>

var Redirect = {
  index: {
    % for hash, (game, stream) in stream_map.items():
    "${hash}": "/links/${game['filename']}#${hash}",
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
    "${category['code']}": [
      % for game in category['games']:
        % if type(game) == Game:
      {name: "${game['name']}", path: "${"/links/" + game['filename']}", year: ${game.date.year}},
        % elif type(game) == SegmentReference:
          % if game.game not in listed_games:
      {name: "${game.game['name']}", path: "${"/links/" + game.game['filename']}", year: ${game.date.year}},
<% listed_games.append(game.game) %>\
          % endif
      {name: "${game['name']}", path: "/links/${game.game['filename']}#${game.hash}", year: ${game.date.year}},
        % endif
      % endfor
    ],
    % endfor
  },

  categories: [
    % for category in categories:
    {header: "${category['name']}", listLocation: "${category['code']}"},
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
