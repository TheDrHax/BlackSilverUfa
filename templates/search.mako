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
  index: {
<% listed_games = [] %>\
    % for category in categories:
      % for game in category['games']:
        % if type(game) == Game:
    "${game['name']}": "${"/links/" + game['filename']}",
        % elif type(game) == SegmentReference:
          % if game.game not in listed_games:
    "${game.game['name']}": "${"/links/" + game.game['filename']}",
<% listed_games.append(game.game) %>\
          % endif
    "${game['name']}": "/links/${game.game['filename']}#${game.hash}",
        % endif
      % endfor
    % endfor
  },

  select: function (value) {
    let dest = this.index[value];
    if (dest !== undefined) {
      window.location = dest;
    }
  },

  init: function() {
    let search = $("#search");

    search.autocomplete({
      source: Object.keys(this.index),
      autoFocus: true,
      minLength: 2,
      select: function(event, ui) { Search.select(ui.item.value); },
      position: { my: "right top", at: "right bottom", "collision": "fit" }
    });

    search.form().submit(function(e) {
      Search.select(search.val());
      e.preventDefault();
    });
  }
};
