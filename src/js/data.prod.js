export default function load() {
  return Promise.all([
    fetch('/data/segments.json').then((res) => res.json()),
    fetch('/data/categories.json').then((res) => res.json()),
    fetch('/data/games.json').then((res) => res.json()),
  ]).then((data) => (
    [...data, fetch('/data/timecodes.json').then((res) => res.json())]
  ));
}
