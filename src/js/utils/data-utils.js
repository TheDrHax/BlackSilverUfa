import { zip, last, uniq } from 'lodash';
import { renderTemplate } from '../pages/search-page/utils';
import Sugar from './sugar';

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
    .filter(([start, end]) => end <= t)
    .reduce((offset, [start, end]) => (
      (t > offset + end)
        ? offset + (end - start)
        : offset
    ), segment.abs_start))
);

export const getBaseSegment = (segments, segment, t) => {
  let at = getAbsTime(t || 0, segment);

  let stream;

  if (segment.streams.length > 1) { // joined stream
    let offset;

    [stream, offset] = last(
      zip(segment.streams, segment.offsets)
        .filter(([s, o]) => o <= at),
    );

    at -= offset;
  } else {
    [stream] = segment.streams;
  }

  segment = segments.by('segment', stream);
  return [segment, at, getRelTime(at, segment)];
};

export const getSiblingSegments = (segments, segment, at) => {
  const [base] = getBaseSegment(segments, segment, at);
  return segments.find({ streams: { $contains: base.segment } });
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
    [segment, at] = getBaseSegment(segments, segment, at);
    segmentId = segment.segment;

    // Find joined stream (the only possible reason of empty refs for now)
    [segment] = segments.chain()
      .find({ streams: { $contains: segmentId } })
      .where((s) => s.streams.length > 1)
      .data();

    if (!segment) return [null];

    const offset = segment.offsets[segment.streams.indexOf(segmentId)];
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

export const getSegmentDescription = ({ date }) => Sugar.Date.short(date);

export const getGameDescription = ({ streams: refs }) => {
  if (refs.length === 0) {
    return '0 стримов';
  }

  const count = renderTemplate(
    '{n} стрим{n#,а,ов}',
    { n: uniq(refs.map(({ segment }) => segment.split('.')[0])).length },
  );

  const refDate = ({ original: { date } }) => Sugar.Date.short(date);
  const startDate = refDate(refs[0]);
  const endDate = refDate(last(refs));

  if (startDate !== endDate) {
    return `${count} с ${startDate} по ${endDate}`;
  } else {
    return `${count} ${startDate}`;
  }
};
