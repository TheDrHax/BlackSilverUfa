import Persist from './data-persist';

export default async function load() {
  return Promise.all([
    fetch('/data/segments.json').then((res) => res.json()),
    fetch('/data/categories.json').then((res) => res.json()),
    fetch('/data/games.json').then((res) => res.json()),
    Persist,
  ]).then((data) => (
    [...data, fetch('/data/timecodes.json').then((res) => res.json())]
  ));
}
