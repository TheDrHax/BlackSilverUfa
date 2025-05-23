import Loki from 'lokijs';

const Persist = new Promise((resolve, reject) => {
  let tmp = null;

  tmp = new Loki('BSU-persist', {
    autoload: true,
    autoloadCallback: () => resolve(tmp),
    autosave: true,
    autosaveInterval: 5000,
  });
}).then((db) => {
  const resume = db.getCollection('resume_playback') || db.addCollection('resume_playback');
  resume.ensureIndex('id');

  if (typeof localStorage === 'undefined') {
    return db;
  }

  const oldResume = JSON.parse(localStorage.getItem('resume_playback'));
  if (oldResume) {
    console.log('Migrating resume_playback');

    resume.clear();
    resume.insert(Object.entries(oldResume).map(([k, v]) => ({
      id: k,
      ts: v,
      full: false,
    })));

    delete localStorage.removeItem('resume_playback');
  }

  return db;
});

export default Persist;
