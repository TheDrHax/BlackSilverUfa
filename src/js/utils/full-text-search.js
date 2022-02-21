import uniq from 'lodash/uniq';

export function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/ё/g, 'е')
    .split(' ')
    .map((word) => {
      const match = word.match(/[a-zа-я0-9]+/g);
      return match ? match.join('') : '';
    })
    .filter((w) => w);
}

export default function fts(query, items, lambda = (x) => x) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const pattern = new RegExp(`(\\s+|^)(${tokens.join('|')})`, 'ig');
  const onlyNumbers = tokens.filter((s) => Number.isNaN(Number(s))).length === 0;

  let maxRank = 0;

  return items
    .map((item) => {
      const match = uniq(
        (
          tokenize(lambda(item))
            .join(' ')
            .match(pattern)
          || []
        ).map((m) => m.trim()),
      );

      const fullRank = match.length;
      let rank = match.filter((w) => Number.isNaN(Number(w))).length;

      if (rank > 0 || onlyNumbers) {
        rank = fullRank;
      }

      if (rank > maxRank) {
        maxRank = rank;
      }

      return { item, rank };
    })
    .filter((item) => item.rank === maxRank && item.rank > 0)
    .map((item) => item.item);
}
