import React, { useState } from 'react';
import getHistory from 'react-router-global-history';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
// Components
import { Form } from 'react-bootstrap';
// Namespace
import PropTypes from 'prop-types';
import { common as t } from '../../constants/texts';
// Utils
import Matomo from '../../matomo';
import fts from '../../utils/full-text-search';

export const MIN_CHARS = 2;
export const MAX_CHARS = 20;

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

const HeaderQuickSearch = ({ indexStore, segmentsStore }) => {
  const [suggestions, setSuggestions] = useState({
    options: [],
    query: null,
  });

  const handleSelect = (items) => {
    if (!items.length) return;

    const [item] = items;
    const { query, options } = suggestions;

    Matomo.trackSiteSearch({
      keyword: query,
      category: 'quick-search',
      count: options.length,
    });

    const history = getHistory();
    history.push(item.url);
  };

  const handleSubmit = (e) => e.preventDefault();
  const handleSearch = (query) => {
    // todo: there was some this.clear() call for this. need to research @zaprvalcer
    if (query.length < MIN_CHARS) return;

    const matches = hasStreamId(query)
      ? getByStreamId(query, segmentsStore)
      : getByTextMatch(query, indexStore);

    const options = matches.map(({ name, url }) => ({ name, url }));
    setSuggestions({ query, options });
  };

  return (
    <Form
      inline
      autoComplete="false"
      onSubmit={handleSubmit}
    >
      <AsyncTypeahead
        flip
        paginate
        highlightOnlyResult
        id="quick-search"
        labelKey="name"
        delay={0}
        filterBy={() => true} /* todo: research parameters, maybe we could use them @zaprvalcer */
        isLoading={false}
        minLength={MIN_CHARS}
        maxResults={MAX_CHARS}
        onSearch={handleSearch}
        onChange={handleSelect}
        options={suggestions.options}
        placeholder={t.quickSearch.placeholder}
        emptyLabel={t.quickSearch.emptyLabel}
        promptText={t.quickSearch.runningLabel}
        paginationText={t.quickSearch.moreLabel}
        renderMenuItemChildren={(option) => (
          // TODO: Добавить дату и количество стримов
          <span>{option.name}</span>
        )}
      />
    </Form>
  );
};

HeaderQuickSearch.propTypes = {
  indexStore: PropTypes.object.isRequired,
  segmentsStore: PropTypes.object.isRequired,

};

export default HeaderQuickSearch;
