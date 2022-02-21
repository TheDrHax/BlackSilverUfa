import React, { useEffect } from 'react';
import { useQueryParam, StringParam, NumberParam, DateParam, BooleanParam } from 'use-query-params';
import { Row, Col, Form } from 'react-bootstrap';
// Utils
import flow from 'lodash/flow';
import animateScrollTo from 'animated-scroll-to';
import Matomo from '../../matomo';
import fts, { tokenize } from '../../utils/full-text-search';
// Hooks
import { useComplexState } from '../../hooks/use-complex-state';
import { useComplexQueryState, withSquashedDefault } from '../../hooks/use-complex-query-state';
import { useDataStore } from '../../hooks/use-data-store';
// Namespace
import { searchPage as t } from '../../constants/texts';
// Components
import { Layout } from '../../components';
import ControlPanel from './control-panel';
import SearchResults from './search-results';
import { DEFAULT_SCALE } from './constants';
import { useResponsiveValue } from '../../hooks/use-breakpoints';
import TextFilter from './text-filter';

const getDateParams = (startDate, endDate) => (endDate
  ? { $between: [startDate, endDate] }
  : { $dteq: startDate });

const getGamesFlow = (index, category) => flow([
  () => index.chain(),
  (chain) => (category === 'any' ? chain : chain.find({ 'category.id': category })),
]);

const getSegmentsFlow = (segments, startDate, endDate) => flow([
  () => segments.chain(),
  (chain) => (startDate ? chain.find({ date: getDateParams(startDate, endDate) }) : chain),
  (chain) => chain.find({ games: { $size: { $gt: 0 } } }),
]);

const getSortFlow = (chain, sortBy, isDesc) => {
  const sortParams = sortBy === 'date'
    ? [['date', isDesc], ['segment', isDesc]]
    : [['streams', isDesc], ['date', isDesc], ['segment', isDesc]];

  return chain.compoundsort(sortParams);
};

const executeSearch = ({ mode, data, q: text, category, from, to, sortBy, isDesc }) => flow([
  mode === 'segments'
    ? getSegmentsFlow(data.segments, from, to)
    : getGamesFlow(data.index, category),
  (chain) => getSortFlow(chain, sortBy, isDesc),
  (chain) => (tokenize(text).length ? fts(text, chain.data(), (s) => s.name) : chain.data()),
])();

const reportSearchEvent = (mode, text, count) => {
  if (!tokenize(text).length) return;
  Matomo.trackSiteSearch({
    keyword: text,
    category: mode,
    count,
  });
};

const SCHEMA_FILTERS = {
  q: withSquashedDefault(StringParam, ''),
  category: withSquashedDefault(StringParam, 'any'),
  scale: withSquashedDefault(StringParam, DEFAULT_SCALE),
  from: DateParam,
  to: DateParam,
};
const SCHEMA_SORTING = {
  sortBy: withSquashedDefault(StringParam, 'date'),
  isDesc: withSquashedDefault(BooleanParam, true),
  limit: withSquashedDefault(NumberParam, 10),
};
const INIT_RESULTS = {
  mode: null,
  items: [],
  page: 0,
};

const SearchPage = () => {
  const [data, isReady] = useDataStore();
  const [mode, setMode] = useQueryParam('mode', withSquashedDefault(StringParam, 'segments'));
  const [page, setPage] = useQueryParam('page', withSquashedDefault(NumberParam, 1));
  const [filters, updateFilters] = useComplexQueryState(SCHEMA_FILTERS);
  const [sorting, updateSorting] = useComplexQueryState(SCHEMA_SORTING);
  const [results, updateResults] = useComplexState(INIT_RESULTS);
  const collapsed = useResponsiveValue([true, true, true, false]);

  const submitForm = (event) => {
    event?.preventDefault();
    const items = executeSearch({ mode, data, ...filters, ...sorting });
    updateResults({ mode, items, page: 0 });
    if (event) reportSearchEvent(mode, filters.text, items.length);
  };

  useEffect(() => {
    animateScrollTo(0, {
      cancelOnUserAction: false,
      elementToScroll: document.getElementById('app'),
    });
  }, [page]);

  useEffect(() => {
    if (!isReady) return;
    submitForm();
  }, [data, mode, filters, sorting]);

  const leftSidebarClasses = [
    'search-control',
    collapsed ? 'collapsed' : 'border-start',
  ].filter(Boolean).join(' ');

  return (
    <Layout isLoading={!isReady} title={t.title} fluid="lg">
      <Row className="search">
        <Col className={leftSidebarClasses}>
          <ControlPanel
            mode={mode}
            filters={filters}
            sorting={sorting}
            segments={data.segments}
            categories={data.categories}
            onModeChange={setMode}
            onFiltersChange={updateFilters}
            onSortingChange={updateSorting}
          />
        </Col>
        <Col className="mt-3">
          <Row>
            <Col className="px-4">
              <TextFilter
                initValue={filters.q}
                onSubmit={(q) => updateFilters({ q })}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {!!results.mode && (
                <SearchResults
                  mode={results.mode}
                  items={results.items}
                  limit={sorting.limit}
                  page={page - 1}
                  onPageChange={(input) => setPage(input + 1)}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};

export default SearchPage;
