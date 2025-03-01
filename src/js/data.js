import Loki from 'lokijs';
import uniq from 'lodash/uniq';
import MiniSearch from 'minisearch';
import zip from 'lodash/zip';
import { tokenize } from './utils/text-utils';
import loadData from './data.prod';
import config from '../../config/config.json';
import { upsert, insertSortedBy, getBaseSegment } from './utils/data-utils';
import { ptime } from './utils/time-utils';

const fallbackPrefix = config.fallback.prefix;

function createIndex(collection, fields) {
  const index = new MiniSearch({
    fields,
    searchOptions: {
      prefix: true,
      fuzzy: 0,
    },
    tokenize,
  });

  // .search doesn't expose matching terms
  index.search = function (query, searchOptions = {}) {
    const rawRes = this.executeQuery(query, searchOptions);
    const results = [];

    for (const [id, res] of rawRes) {
      const result = {
        // eslint-disable-next-line no-underscore-dangle
        id: this._documentIds.get(id),

        ...res,

        score: res.score * res.terms.length,

        // eslint-disable-next-line no-underscore-dangle
        ...this._storedFields.get(id),
      };

      if (searchOptions.filter == null || searchOptions.filter(result)) {
        results.push(result);
      }
    }

    results.sort(({ score: a }, { score: b }) => b - a);
    return results;
  };

  const chainOrig = collection.chain;
  collection.chain = function () {
    const chain = chainOrig.call(collection);

    chain.search = (query) => {
      const results = index.search(query);

      const maxTerms = results.reduce((acc, cur) => {
        const terms = cur.terms.length;
        return terms > acc ? terms : acc;
      }, 0);

      const ids = results
        // Prefer matches with the most matching terms
        .filter(({ terms }) => terms.length === maxTerms)
        // Skip only numerical matches
        .filter(({ terms }) => terms.filter((t) => Number.isNaN(+t)).length > 0)
        .map(({ id }) => id);
      return chain.find({ $loki: { $in: ids } });
    };

    return chain;
  };

  collection.search = (query) => collection.chain.search(query).data();

  collection.reindex = () => {
    index.removeAll();
    index.addAll(
      collection
        .find()
        .map((item) => ({ ...item, id: item.$loki })),
    );
  };

  collection.reindex();
}

function build([rawSegments, rawCategories, rawGames, persist, timecodes]) {
  const db = new Loki('BSU');

  const segments = db.addCollection('segments', {
    indices: ['segment'],
  });
  const categories = db.addCollection('categories');
  const index = db.addCollection('index');
  const games = db.addCollection('games');
  const resume = persist?.getCollection('resume_playback');

  function setWatched(ts, { end } = { end: true }) {
    ts = Math.round(ts);
    this.watched = ts;

    if (!resume) return;

    const [stream, at] = getBaseSegment(this, ts);
    upsert(resume, ['id'], {
      id: stream,
      ts: at,
      full: end,
    });
  }

  Object.keys(rawSegments)
    .sort((a, b) => String(a).localeCompare(b))
    .map((k) => [k, rawSegments[k]])
    .forEach(([key, segment]) => {
      segment.date = new Date(`${segment.date}T00:00:00`);
      segment.segment = key;
      segment.subrefs = [];

      if (segment.youtube) {
        segment.thumbnail = `https://img.youtube.com/vi/${segment.youtube}/mqdefault.jpg`;
      } else {
        segment.thumbnail = `${fallbackPrefix}/${segment.segment}-sm.jpg`;
        segment.poster = `${fallbackPrefix}/${segment.segment}.jpg`;
      }

      if (key.indexOf(',') !== -1) {
        segment.streams = key.split(',');
      } else {
        segment.streams = [key.split('.')[0]];
      }

      segment.url = `/play/${segment.games[0]}/${key}`;

      segment.offsets = Object.fromEntries(zip(
        segment.streams,
        segment.offsets?.map((o) => ptime(o.split('+')[0])) || [segment.abs_start],
      ));

      segment.watched = 0;

      if (resume) {
        const parts = resume
          .find({ id: { $in: segment.streams } })
          .sort(({ id1 }, { id2 }) => segment.offsets[id2] - segment.offsets[id1]);

        if (parts.length > 0) {
          segment.watched = segment.offsets[parts[0].id] + parts[0].ts;
        }
      }

      segment.setWatched = setWatched.bind(segment);

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

    game.streams.forEach((ref) => {
      ref.name = ref.subrefs
        .filter((s) => !s.hidden)
        .map(({ name }) => name)
        .join(' / ');

      ref.original = segments.by('segment', ref.segment);
      ref.start = ref.subrefs[0].start || ref.original.abs_start;
      ref.game = game;

      ref.subrefs.forEach((subref) => {
        subref.parent = ref;
        insertSortedBy(ref.original.subrefs, subref, 'start');
      });

      ref.url = `/play/${game.id}/${ref.segment}`;
      if (ref.start) {
        ref.url += `?at=${ref.start}`;
      }

      if (game.type === 'list') {
        const origSegment = segments.by('segment', ref.segment);

        ref.subrefs
          .filter((s) => !s.hidden)
          .forEach((subref) => {
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

  createIndex(index, ['name']);
  createIndex(segments, ['name']);

  return { segments, categories, index, games, persist, timecodes };
}

export async function reload() {
  return loadData().then(build);
}

export const Data = reload();
