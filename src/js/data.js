import Loki from 'lokijs';
import { uniq } from 'lodash';
import loadData from './data.prod';

function build([rawSegments, rawCategories, rawGames, timecodes]) {
  const db = new Loki('BSU');

  const segments = db.addCollection('segments');
  const categories = db.addCollection('categories');
  const index = db.addCollection('index');
  const games = db.addCollection('games');

  Object.keys(rawSegments)
    .sort((a, b) => String(a).localeCompare(b))
    .map((k) => [k, rawSegments[k]])
    .forEach(([key, segment]) => {
      segment.date = new Date(`${segment.date}T00:00:00`);
      segment.segment = key;

      if (segment.youtube) {
        segment.thumbnail = `https://img.youtube.com/vi/${segment.youtube}/mqdefault.jpg`;
      } else {
        segment.thumbnail = '/static/images/no-preview.png';
      }

      if (key.indexOf('.') !== -1) {
        segment.streams = [key.split('.')[0]];
      } else if (key.indexOf(',') !== -1) {
        segment.streams = key.split(',');
      } else {
        segment.streams = [key];
      }

      segment.url = `/play/${segment.games[0]}/${key}`;

      segments.insert(segment);
    });

  rawGames.forEach((game) => {
    game.streams.forEach((ref) => {
      ref.url = `/play/${game.id}/${ref.segment}`;
      ref.game = game;
      ref.original = segments.by('segment', ref.segment);

      if (ref.start) {
        ref.url += `?at=${ref.start}`;
      } else {
        ref.start = ref.original.abs_start;
      }
    });

    games.insert(game);
  });

  Object.entries(rawCategories).forEach(([key, category]) => {
    const catGames = category.games;
    delete category.games;

    category.id = key;
    categories.insert(category);

    catGames.forEach((game) => {
      game.category = category;
      game.original = games.by('id', game.id);

      if (game.start === undefined) { // game
        game.segments = segments
          .chain()
          .find({ games: { $contains: game.id } })
          .simplesort('date')
          .data();

        game.url = `/play/${game.id}`;
      } else { // segment
        game.segments = [segments.by('segment', game.segment)];
        game.url = `/play/${game.id}/${game.segment}`;

        if (game.start > 0) {
          game.url += `?at=${game.start}`;
        }
      }

      game.streams = uniq(game.segments.map((segment) => {
        const dot = segment.segment.indexOf('.');
        if (dot !== -1) {
          return segment.segment.substring(0, dot);
        }
        return segment.segment;
      })).length;

      game.date = game.segments[0].date;

      index.insert(game);
    });
  });

  return { segments, categories, index, games, timecodes };
}

async function reload() {
  return loadData().then(build);
}

const Data = reload();

export { Data, reload };
