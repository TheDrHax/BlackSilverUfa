import { zip, last } from 'lodash';

const getBaseSegment = (segments, segment, at) => {
  at = at || 0;

  let stream;

  if (segment.streams.length > 1) { // joined stream
    let offset;

    [stream, offset] = last(
      zip(segment.streams, segment.offsets)
        .filter(([s, o]) => o < at),
    );

    at -= offset;
  } else {
    [stream] = segment.streams;
  }

  segment = segments.by('segment', stream);
  return [segment, at];
};

const getSiblingSegments = (segments, segment, at) => {
  const [base] = getBaseSegment(segments, segment, at);
  return segments.find({ streams: { $contains: base.segment } });
};

const resolveSegment = (segments, segmentId, at) => {
  at = at || 0;

  let segment = segments.by('segment', segmentId);

  // Handle missing segments
  if (!segment) {
    if (segmentId.indexOf('.') !== -1) { // secondary segment removed
      [segmentId] = segmentId.split('.');
    } else if (segmentId.indexOf(',') !== -1) { // previously joined
      // We don't know offsets anymore, so redirect to the beginning
      // of the first stream
      [segmentId] = segmentId.split(',');
      at = 0;
    }

    segment = segments.by('segment', segmentId);
  }

  if (!segment) {
    return [null];
  }

  // Handle segments without refs
  if (segment.games.length === 0) {
    [segment, at] = getBaseSegment(segments, segment, at);
    segmentId = segment.segment;

    [segment] = segments.chain()
      .find({ streams: { $contains: segmentId } })
      .where((s) => s.streams.length > 1)
      .data();

    if (!segment) return [null];

    let offset = segment.offsets[segment.streams.indexOf(segmentId)];
    if (segment.cuts) {
      offset += segment.cuts
        .filter(([start, end]) => end <= at + offset)
        .map(([start, end]) => start - end)
        .reduce((a, b) => a + b, 0);
    }

    at += offset;
  }

  // Handle timestamp out of bounds
  if (at < segment.abs_start || at >= segment.abs_end) {
    let candidates = getSiblingSegments(segments, segment, at)
      .filter((s) => s.abs_end > at)
      .filter((s) => s.games.length > 0)
      .sort((a, b) => a.abs_start - b.abs_start);

    if (candidates.length > 0) {
      at = Math.max(at, candidates[0].abs_start);
      candidates = candidates.filter((s) => s.abs_start <= at);

      if (candidates.length > 0) {
        [segment] = candidates;
      }
    }
  }

  return [segment, at];
};

export { getBaseSegment, resolveSegment };
