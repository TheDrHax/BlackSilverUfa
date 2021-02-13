import * as loki from 'lokijs';

const db = new loki('BSU');

class Data {
  static segments = fetch('/data/segments.json').then((res) => {
    return res.json();
  }).then((data) => {
    let segments_collection = db.addCollection('segments');

    Object.keys(data)
      .sort((a, b) => String(a).localeCompare(b))
      .map((k) => [k, data[k]])
      .map(([key, segment]) => {
        segment.date = new Date(segment.date);
        segment.segment = key;
        segments_collection.insert(segment);
      });

    return segments_collection;
  });

  static categories = fetch('/data/categories.json').then((res) => {
    return res.json();
  });

  static games = Data.categories.then((categories) => {
    let categories_collection = db.addCollection('categories');
    let games_collection = db.addCollection('games');

    Object.entries(categories).map(([cat_key, category]) => {
      let games = category.games;
      delete category['games'];
      category.id = cat_key;
      categories_collection.insert(category);

      games.map((game) => {
        game.category = category;

        game.name.split(' / ').map((name) => {
          games_collection.insert({
            ...game,
            name: name
          });
        });
      });
    });

    return games_collection;
  });
}

export { Data };