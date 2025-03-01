import last from 'lodash/last';
import uniq from 'lodash/uniq';
import find from 'lodash/find';
import sortedIndexBy from 'lodash/sortedIndexBy';
import { renderTemplate } from './text-utils';
import SugarDate from './sugar';

export const upsert = (db, keys, obj) => {
  const filter = Object.assign({}, ...keys.map((k) => ({ [k]: obj[k] })));
  let x = db.findOne(filter);

  if (!x) {
    db.insert(obj);
    return obj;
  } else {
    x = { ...x, ...obj };
    db.update(x);
    return x;
  }
};

export const insertSortedBy = (a, v, i) => a.splice(sortedIndexBy(a, v, i), 0, v);

export const getOffset = (segment, at) => {
  at = at || 0;

  let offset = segment.abs_start;

  offset += (segment.cuts || [])
    .filter(([start, end]) => end > offset && end <= at)
    .map(([start, end]) => end - Math.max(offset, start))
    .reduce((a, b) => a + b, 0);

  return offset;
};

export const getRelTime = (at, segment) => at - getOffset(segment, at);

export const getAbsTime = (t, segment) => (
  t + ((segment.cuts || [])
    .reduce((offset, [start, end]) => (
      (t > offset + end)
        ? offset + (end - start)
        : offset
    ), segment.abs_start))
);

export const getBaseSegment = (segment, t) => {
  let at = getAbsTime(t || 0, segment);

  let stream;

  if (segment.streams.length > 1) { // joined stream
    let offset;

    [stream, offset] = last(
      segment.streams
        .map((s) => [s, segment.offsets[s]])
        .filter(([s, o]) => o <= at),
    );

    at -= offset;
  } else {
    [stream] = segment.streams;
  }

  return [stream, at, getRelTime(at, segment)];
};

export const getSiblingSegments = (segments, segment, at) => {
  const [baseId] = getBaseSegment(segment, at);
  return segments.find({ streams: { $contains: baseId } });
};

export const resolveSegment = (segments, segmentId, at) => {
  let segment = segments.by('segment', segmentId);

  // Handle missing segments
  if (!segment) {
    if (segmentId.indexOf('.') !== -1) { // secondary segment removed
      [segmentId] = segmentId.split('.');
    } else if (segmentId.indexOf(',') !== -1) { // previously joined
      // We don't know offsets anymore, so redirect to the beginning
      // of the first stream
      [segmentId] = segmentId.split(',').filter((id) => segments.by('segment', id));
      at = 0;
    }

    if (!segmentId) {
      return [null];
    }

    segment = segments.by('segment', segmentId);

    if (!segment) {
      return [null];
    }
  }

  // Handle segments without refs
  if (segment.games.length === 0) {
    [segmentId, at] = getBaseSegment(segment, at);

    // Find joined stream (the only possible reason of empty refs for now)
    [segment] = segments.chain()
      .find({ streams: { $contains: segmentId } })
      .where((s) => s.streams.length > 1)
      .data();

    if (!segment) return [null];

    const offset = segment.offsets[segmentId];
    at = (at || 0) + offset;
  }

  // Handle timestamp out of bounds
  if (at != null && (at < segment.abs_start || at >= segment.abs_end)) {
    const candidates = getSiblingSegments(segments, segment, at)
      .filter((s) => s.abs_end > at)
      .filter((s) => s.games.length > 0)
      .sort((a, b) => a.abs_start - b.abs_start);

    if (candidates.length > 0) {
      if (candidates[0].abs_start > at) {
        at = candidates[0].abs_start;
      }

      [segment] = candidates;
    }
  }

  const t = at != null ? getRelTime(at, segment) : undefined;

  return [segment, at, t];
};

export const findRefBySegment = (game, segment) => (
  find(game.streams, ({ segment: s }) => s === segment.segment)
);

export const resolveGame = (games, segment, at) => {
  let res = segment.games
    .map((id) => {
      const game = games.by('id', id);
      const ref = findRefBySegment(game, segment);
      return [game, ref];
    })
    .filter(([game, ref]) => ref.subrefs[0].start <= (at || segment.abs_start))
    .sort(([gameA, refA], [gameB, refB]) => refB.subrefs[0].start - refA.subrefs[0].start)[0];

  if (!res) { // for segments where first ref has `start` parameter
    const game = games.by('id', segment.games[0]);
    res = [game, findRefBySegment(game, segment)];
  }

  return res;
};

export const getSegmentDescription = ({ date }) => SugarDate.short(date);

export const getGameDescription = ({ streams: refs }) => {
  if (refs.length === 0) {
    return '0 стримов';
  }

  const count = renderTemplate(
    '{n} стрим{n#,а,ов}',
    { n: uniq(refs.map(({ segment }) => segment.split('.')[0])).length },
  );

  const refDate = ({ original: { date } }) => SugarDate.short(date);
  const startDate = refDate(refs[0]);
  const endDate = refDate(last(refs));

  if (startDate !== endDate) {
    return `${count} с ${startDate} по ${endDate}`;
  } else {
    return `${count} ${startDate}`;
  }
};
