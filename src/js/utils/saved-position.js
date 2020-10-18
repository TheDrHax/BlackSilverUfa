const resume = JSON.parse(localStorage.getItem('resume_playback')) || {};

class SavedPosition {
  constructor(stream) {
    this.ids = stream.twitch.split(',');

    if (stream.offsets) {
      this.offsets = stream.offsets.split(',').map((t) => +t);
    } else if (stream.offset) {
      this.offsets = [stream.offset];
    } else {
      this.offsets = [0];
    }
  }

  set(t) {
    let match = null;

    this.ids.map((id, i) => {
      let offset = this.offsets[i];

      if (t >= offset) {
        match = [id, offset];
      }

      delete resume[id];
    });

    if (match !== null) {
      resume[match[0]] = t - match[1];
      localStorage.setItem('resume_playback', JSON.stringify(resume));
    }
  }

  get() {
    let positions = this.ids.map((id, i) => {
      return +resume[id] + this.offsets[i];
    }).filter((x) => !isNaN(x));

    return positions[positions.length - 1];
  }

  exists() {
    for (let i = 0; i < this.ids.length; i++) {
      if (resume[this.ids[i]]) {
        return true;
      }
    }

    return false;
  }
}

export { SavedPosition };