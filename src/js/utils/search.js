export const tokenize = (text = '') => text
  .trim()
  .split(' ')
  .map((word) => word.toLowerCase().replaceAll(/[^a-zа-я0-9]+/ig, ''))
  .filter((word) => !!word);

const getRank = (criterias, words) => criterias
  .reduce((accumulator, criteria) => {
    const hasMatch = words.find((word) => word.startsWith(criteria));
    return hasMatch ? accumulator + 1 : accumulator;
  }, 0);

export const filterByText = (query, items) => {
  const criterias = tokenize(query);

  const itemsPerRank = items.reduce((result, item) => {
    const words = tokenize(item.name);
    const rank = getRank(criterias, words);

    if (result[rank]) {
      result[rank].push(item);
    } else {
      result[rank] = [item];
    }

    return result;
  }, {});

  const maxRank = Object.keys(itemsPerRank).sort().pop();
  return Number(maxRank) ? itemsPerRank[maxRank] : [];
};
