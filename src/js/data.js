import Loki from 'lokijs';
import uniq from 'lodash/uniq';
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

  Object.entries(rawCategories).forEach(([key, category]) => {
    category.id = key;
    categories.insert(category);
  });

  rawGames.forEach((game) => {
    games.insert(game);

    const indexEntry = {
      category: categories.by('id', game.category),
      original: game,
    };

    if (game.type !== 'list') {
      const gameSegments = segments
        .chain()
        .find({ games: { $contains: game.id } })
        .simplesort('date')
        .data();

      const gameStreams = uniq(gameSegments.map((segment) => {
        const dot = segment.segment.indexOf('.');
        if (dot !== -1) {
          return segment.segment.substring(0, dot);
        }
        return segment.segment;
      })).length;

      index.insert({
        ...indexEntry,
        name: game.name,
        segment: game.streams[0].segment,
        segments: gameSegments,
        url: `/play/${game.id}`,
        streams: gameStreams,
        date: gameSegments[0].date,
      });
    }

    game.streams.forEach((ref) => {
      ref.name = uniq(ref.subrefs.map(({ name }) => name)).join(' / ');
      ref.url = `/play/${game.id}/${ref.segment}`;
      ref.game = game;
      ref.original = segments.by('segment', ref.segment);

      if (ref.start) {
        ref.url += `?at=${ref.start}`;
      } else {
        ref.start = ref.original.abs_start;
      }

      if (game.type === 'list') {
        const origSegment = segments.by('segment', ref.segment);

        ref.subrefs.forEach((subref) => {
          let url = `/play/${game.id}/${ref.segment}`;

          if (subref.start > 0) {
            url += `?at=${subref.start}`;
          }

          index.insert({
            ...indexEntry,
            name: subref.name,
            segment: ref.segment,
            start: subref.start,
            segments: [origSegment],
            url,
            streams: 1,
            date: origSegment.date,
          });
        });
      }
    });
  });

  return { segments, categories, index, games, timecodes };
}

export async function reload() {
  return loadData().then(build);
}

export const Data = reload();
