import React, { useState } from 'react';
import getHistory from 'react-router-global-history';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
// Components
import { Form, Nav } from 'react-bootstrap';
// Namespace
import PropTypes from 'prop-types';
import { common as t } from '../../constants/texts';
// Utils
import Matomo from '../../matomo';
import { getSiblingSegments, resolveSegment } from '../../utils/data-utils';

export const MIN_QUERY = 2;
export const MAX_RESULTS = 20;

export const getByTextMatch = (query, store) => (
  store
    .chain()
    .search(query)
    .simplesort('date', { desc: true })
    .data()
);

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
    const [segment] = resolveSegment(segmentsStore, query.trim());

    let matches = [segment];

    if (segment) {
      if (query.match(/^[0-9]+$/)) { // stream ID
        matches = getSiblingSegments(segmentsStore, segment);
      } else {
        matches = [segment];
      }
    } else {
      matches = getByTextMatch(query, indexStore);
    }

    const options = matches.map(({ name, url }) => ({ name, url }));
    setSuggestions({ query, options });
  };

  return (
    <Nav
      as={Form}
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
        minLength={MIN_QUERY}
        maxResults={MAX_RESULTS}
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
    </Nav>
  );
};

HeaderQuickSearch.propTypes = {
  indexStore: PropTypes.object.isRequired,
  segmentsStore: PropTypes.object.isRequired,
};

export default HeaderQuickSearch;
