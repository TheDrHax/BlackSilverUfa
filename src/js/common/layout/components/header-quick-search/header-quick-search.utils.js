import fts from '../../../../utils/full-text-search';

export const hasStreamId = (query) => /^\d+$/.test(query);

export const getByStreamId = (query, store) => store.chain()
  .find({ streams: { $contains: query } })
  .where((segment) => segment.games.length)
  .data();

export const getByTextMatch = (query, store) => {
  const data = store.chain()
    .where((item) => item.category.search !== false)
    .simplesort('date', { desc: true })
    .data();

  // TODO: dig into it and refactor fts @zaprvalcer
  return fts(
    query,
    data,
    (item) => item.name,
  );
};
