class Data {
  static segments = fetch('/data/segments.json').then((res) => {
    return res.json();
  });

  static categories = fetch('/data/categories.json').then((res) => {
    return res.json();
  });

  static games = Data.categories.then((categories) => {
    // Create flat array of games and add category name to each of them
    let games = Object.keys(categories).flatMap((key) => {
      let category = categories[key];

      if (category.search === false) {
        return [];
      }

      return category.games.flatMap((game) => {
        game.group = category.name;

        let names = game.name.split(' / ');

        if (names.length > 1) {
          return names.map((name) => {
            let subref = Object.assign({}, game);
            subref.name = name;
            return subref;
          });
        } else {
          return game;
        }
      });
    });

    return games;
  });
}

export { Data };