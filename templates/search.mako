<%! from templates.data.timecodes import Timecode %>\
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
    window.location.replace(this.link(hash));
  }
}

var Search = {
  index: {
    % for category in categories:
      % for game in category['games']:
    "${game['name']}": "${"/links/" + game['filename']}",
      % endfor
      % if category.get('type') == 'list':
        % for segment in category['games'][0]['streams']:
    "${segment['name']}": "/links/${stream_map[segment.hash][0]['filename']}#${segment.hash}",
        % endfor
      % endif
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
