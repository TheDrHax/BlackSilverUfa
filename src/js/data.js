import * as loki from 'lokijs';

function reload() {
  return Promise.all([
    fetch('/data/segments.json').then((res) => res.json()),
    fetch('/data/categories.json').then((res) => res.json())
  ]).then(([segments_raw, categories_raw]) => {
    const db = new loki('BSU');
    const segments = db.addCollection('segments');
    const categories = db.addCollection('categories');
    const games = db.addCollection('games');

    Object.keys(segments_raw)
      .sort((a, b) => String(a).localeCompare(b))
      .map((k) => [k, segments_raw[k]])
      .map(([key, segment]) => {
        segment.date = new Date(segment.date + 'T00:00:00');
        segment.segment = key;
        segments.insert(segment);
      });
    
    Object.entries(categories_raw).map(([cat_key, category]) => {
      let games_raw = category.games;
      delete category['games'];

      category.id = cat_key;
      categories.insert(category);

      games_raw.map((game) => {
        game.category = category;

        if (game.start === undefined) { // game
          game.segments = segments
            .chain()
            .find({ games: { $contains: game.id } })
            .simplesort('date')
            .data();

          game.url = `/links/${game.id}.html`;
        } else { // segment
          game.segments = [segments.by('segment', game.segment)];
          game.url = `/links/${game.id}.html#${game.segment}`;

          if (game.start > 0) {
            game.url += `?at=${game.start}`;
          }
        }

        game.streams = game.segments.map((segment) => {
          let dot = segment.segment.indexOf('.');
          if (dot !== -1) {
            return segment.segment.substring(0, dot);
          } else {
            return segment.segment;
          }
        }).filter((v, i, s) => i == s.indexOf(v)).length;

        game.date = game.segments[0].date;

        games.insert(game);
      });
    });

    return { segments, categories, games };
  });
}

var Data = reload();

export { Data, reload };