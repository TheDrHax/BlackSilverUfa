import React, { useEffect } from 'react';
import { useQueryParam, StringParam, NumberParam, DateParam, BooleanParam } from 'use-query-params';
import { Row, Col, Alert } from 'react-bootstrap';
// Utils
import flow from 'lodash/flow';
import Matomo from '../../matomo';
import { filterByText, tokenize } from '../../utils/search';
// Hooks
import { useComplexState } from '../../hooks/use-complex-state';
import { useComplexQueryState, withSquashedDefault } from '../../hooks/use-complex-query-state';
import { useTitle } from '../../hooks/use-title';
// Namespace
import { searchPage as t } from '../../constants/texts';
// Components
import { Layout } from '../../components';
import ControlPanel from './control-panel';
import SearchResults from './search-results';
import { DEFAULT_SCALE } from './constants';
import { useDataStore } from '../../hooks/use-data-store';

const getDateParams = (startDate, endDate) => (endDate
  ? { $between: [startDate, endDate] }
  : { $dteq: startDate });

const getGamesFlow = (index, category) => flow([
  () => index.chain(),
  (chain) => (category === 'any' ? chain : chain.find({ 'category.id': category })),
  (chain) => chain.where((item) => item.category.search !== false),
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
  (chain) => (tokenize(text).length ? filterByText(text, chain.data()) : chain.data()),
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
};
const INIT_RESULTS = {
  mode: null,
  items: [],
  page: 0,
};

const SearchPage = () => {
  const { isReady, data } = useDataStore();
  const [mode, setMode] = useQueryParam('mode', withSquashedDefault(StringParam, 'segments'));
  const [page, setPage] = useQueryParam('page', withSquashedDefault(NumberParam, 1));
  const [filters, updateFilters] = useComplexQueryState(SCHEMA_FILTERS);
  const [sorting, updateSorting] = useComplexQueryState(SCHEMA_SORTING);
  const [results, updateResults] = useComplexState(INIT_RESULTS);

  const submitForm = (event) => {
    event?.preventDefault();
    const items = executeSearch({ mode, data, ...filters, ...sorting });
    updateResults({ mode, items, page: 0 });
    if (event) reportSearchEvent(mode, filters.text, items.length);
  };

  useTitle(t.title);

  useEffect(() => {
    Matomo.trackPageView();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    submitForm();
  }, [data, mode, filters, sorting]);

  return (
    <Layout isLoading={!isReady}>
      <Row className="pt-3">
        <Col>
          <Alert variant="dark">{t.notification}</Alert>
        </Col>
      </Row>
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
      {!!results.mode && (
      <SearchResults
        mode={results.mode}
        items={results.items}
        page={page - 1}
        segments={data.segments}
        onPageChange={(input) => setPage(input + 1)}
      />
      )}
    </Layout>
  );
};

export default SearchPage;
