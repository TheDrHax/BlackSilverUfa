import React, { useEffect } from 'react';
import { useQueryParam, StringParam, NumberParam, DateParam, BooleanParam } from 'use-query-params';
import { Row, Col } from 'react-bootstrap';
// Utils
import animateScrollTo from 'animated-scroll-to';
import Matomo from '../../matomo';
import { tokenize } from '../../utils/text-utils';
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

const getDateParams = ({ from, to }) => (
  to
    ? { $between: [from, to] }
    : { $dteq: from }
);

const getSortParams = ({ sortBy, isDesc }) => (
  sortBy === 'date'
    ? [['date', isDesc], ['segment', isDesc]]
    : [['streams', isDesc], ['date', isDesc], ['segment', isDesc]]
);

const executeSearch = ({ data: { segments, index }, mode, filters, sorting }) => {
  let chain;
  const query = {};

  switch (mode) {
    case 'segments':
      chain = segments.chain();

      // Show only segments with refs
      query.games = { $size: { $gt: 0 } };

      // Date filter
      if (filters.from) {
        query.date = getDateParams(filters);
      }

      // Source filter
      if (filters.source !== 'any') {
        query[filters.source] = { $exists: true };
      }

      break;

    case 'games':
      chain = index.chain();

      // Category filter
      if (filters.category !== 'any') {
        query['category.id'] = filters.category;
      }

      break;

    default:
      return [];
  }

  chain = chain.find(query);

  // Filter by text
  if (tokenize(filters.q).length > 0) {
    chain = chain.search(filters.q);
  }

  // Sort
  chain = chain.compoundsort(getSortParams(sorting));

  return chain.data();
};

const SCHEMA_FILTERS = {
  q: withSquashedDefault(StringParam, ''),
  category: withSquashedDefault(StringParam, 'any'),
  scale: withSquashedDefault(StringParam, DEFAULT_SCALE),
  from: DateParam,
  to: DateParam,
  source: withSquashedDefault(StringParam, 'any'),
};
const SCHEMA_SORTING = {
  sortBy: withSquashedDefault(StringParam, 'date'),
  isDesc: withSquashedDefault(BooleanParam, true),
  limit: withSquashedDefault(NumberParam, 25),
};
const INIT_RESULTS = {
  mode: null,
  items: [],
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

    const items = executeSearch({ mode, data, filters, sorting });
    if (page !== 1) {
      setPage(1);
    }
    updateResults({ mode, items });

    if (event) {
      if (!tokenize(filters.q).length) return;
      Matomo.trackSiteSearch({
        keyword: filters.q,
        category: mode,
        count: items.length,
      });
    }
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
