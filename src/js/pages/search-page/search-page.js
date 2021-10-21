import React, { useEffect, useState } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
// Utils
import flow from 'lodash/flow';
import { Data } from '../../data';
import Matomo from '../../matomo';
import { filterByText, tokenize } from '../../utils/search';
// Hooks
import { useComplexState } from '../../hooks/use-complex-state';
import { useTitle } from '../../hooks/use-title';
// Namespace
import { searchPage as t } from '../../constants/texts';
// Components
import { Layout } from '../../components';
import ControlPanel from './control-panel';
import SearchResults from './search-results';

const convertCategories = (data) => Object.values(data)
  .filter(({ search }) => search !== false)
  .reduce((result, current) => {
    result[current.id] = current.name;
    return result;
  }, { any: t.categoryAny });

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

const executeSearch = ({ mode, data, text, category, startDate, endDate, sortBy, isDesc }) => flow([
  mode === 'segments'
    ? getSegmentsFlow(data.segments, startDate, endDate)
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

const INIT_DATA = {
  index: null,
  segments: null,
  categories: null,
};
const INIT_FILTERS = {
  text: '',
  category: 'any',
  startDate: null,
  endDate: null,
};
const INIT_SORTING = {
  sortBy: 'date',
  isDesc: true,
};
const INIT_RESULTS = {
  mode: null,
  items: [],
  page: 0,
};

const SearchPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [mode, setMode] = useState('segments');
  const [data, setData] = useComplexState(INIT_DATA);
  const [filters, updateFilters] = useComplexState(INIT_FILTERS);
  const [sorting, updateSorting] = useComplexState(INIT_SORTING);
  const [results, updateResults] = useComplexState(INIT_RESULTS);

  const submitForm = (event) => {
    event?.preventDefault();

    const searchResults = executeSearch({ mode, data, ...filters, ...sorting });
    updateResults({ mode, items: searchResults, page: 0 });
    if (event) reportSearchEvent(mode, filters.text, results.length);
  };

  useTitle(t.title);

  useEffect(() => {
    Matomo.trackPageView();
    Data.then(({ segments, categories, index }) => {
      setData({ index, segments, categories: convertCategories(categories.data) });
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!data.segments) return;
    submitForm();
  }, [data, mode, filters, sorting]);

  return (
    <Layout isLoading={isLoading}>

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
        page={results.page}
        segments={data.segments}
        onPageChange={(input) => updateResults({ page: input })}
      />
      )}
    </Layout>
  );
};

export default SearchPage;
