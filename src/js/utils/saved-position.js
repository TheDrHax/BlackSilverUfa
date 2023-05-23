import last from 'lodash/last';
import zip from 'lodash/zip';

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
    this.streams = segment.streams;
    this.offsets = segment.offsets || [segment.abs_start];
  }

  find(t) {
    const [match] = zip(this.streams, this.offsets)
      .filter(([s, o]) => t >= o);
    return match;
  }

  set(t, { end } = { end: false }) {
    t = Math.round(t);

    const match = this.find(t);
    if (!match) return;

    const [stream, offset] = match;
    upsert(this.db, ['id'], {
      id: stream,
      ts: t - offset,
      full: end,
    });
  }

  get() {
    return last(
      this.streams
        .map((id, i) => this.db.findOne({ id })?.ts + this.offsets[i])
        .filter((x) => !Number.isNaN(x)),
    );
  }

  exists() {
    return !!this.db.findOne({ id: { $in: this.streams } });
  }
}
