import zip from 'lodash/zip';
import reverse from 'lodash/reverse';
import { getBaseSegment } from './data-utils';

function upsert(db, keys, obj) {
  const filter = Object.assign({}, ...keys.map((k) => ({ [k]: obj[k] })));
  const x = db.findOne(filter);

  if (!x) {
    db.insert(obj);
  } else {
    db.update({ ...x, ...obj });
  }
}

export default class SavedPosition {
  constructor(persist, segment) {
    this.db = persist.getCollection('resume_playback');
    this.segment = segment;
  }

  set(t, { end } = { end: false }) {
    t = Math.round(t);

    const match = getBaseSegment(this.segment, t);
    if (!match) return;

    const [stream, offset] = match;
    upsert(this.db, ['id'], {
      id: stream,
      ts: t - offset,
      full: end,
    });
  }

  get() {
    const offsets = this.segment.offsets || [this.segment.abs_start];
    const streams = reverse(zip(this.segment.streams, offsets));

    for (const [id, offset] of streams) {
      const ts = this.db.findOne({ id })?.ts;
      if (ts) {
        return ts + offset;
      }
    }

    return 0;
  }

  exists() {
    return !!this.db.findOne({ id: { $in: this.segment.streams } });
  }
}
