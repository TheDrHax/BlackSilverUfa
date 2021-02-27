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

        if (game.type === 'segment') {
          game.segments = [segments.by('segment', game.segment)];
        } else if (game.type === 'game') {
          game.segments = segments
            .chain()
            .find({ games: { $contains: game.id } })
            .simplesort('date')
            .data();
        }

        game.date = game.segments[0].date;

        game.name.split(' / ').map((name) => {
          games.insert({
            ...game,
            name: name
          });
        });
      });
    });

    return { segments, categories, games };
  });
}

var Data = reload();

export { Data, reload };