import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Form, InputGroup } from 'react-bootstrap';
import { faSortAmountAsc, faSortAmountDesc } from '@fortawesome/free-solid-svg-icons';
import DateFilter from './date-filter';
import { searchPage as t } from '../../constants/texts';
import { MODES, SCALES, SOURCES } from './constants';
import { FAIcon } from '../../utils/fontawesome';
import FormCheckTriState from '../../components/utils/form-check-tri-state';

const SORT_OPTIONS = {
  segments: ['date'],
  games: ['date', 'name', 'stream_count'],
};

const SORT_ICONS = {
  desc: faSortAmountAsc,
  asc: faSortAmountDesc,
};

const convertCategories = (categories) => Object.values(categories)
  .filter(({ search }) => search !== false)
  .reduce((result, current) => {
    result[current.id] = current.name;
    return result;
  }, { any: t.categoryAny });

const ControlPanel = ({ mode,
  filters,
  sorting,
  segments,
  categories,
  onModeChange,
  onFiltersChange,
  onSortingChange,
}) => {
  const direction = sorting.isDesc ? 'desc' : 'asc';

  const filteredCategories = useMemo(() => (
    convertCategories(categories.data)
  ), [categories]);

  const dateState = {
    scale: filters.scale,
    from: filters.from,
    to: filters.to,
  };

  return (
    <>
      <div className="content border-end">
        <Form.Group className="d-flex align-items-baseline">
          <Form.Label>Искать:</Form.Label>
          <ButtonGroup className="ms-2 flex-1-0-0">
            {MODES.map((key) => (
              <Button
                key={key}
                size="sm"
                variant={mode === key ? 'primary' : 'dark'}
                onClick={() => {
                  onModeChange(key);
                  onSortingChange({ sortBy: 'date' });
                }}
              >
                {t.modes[key]}
              </Button>
            ))}
          </ButtonGroup>
        </Form.Group>

        <div className="sidebar-header">Фильтры</div>

        {mode === 'segments' && (
          <InputGroup>
            <FormCheckTriState
              label="Просмотренные"
              value={filters.watched}
              onChange={(value) => onFiltersChange({ watched: value })}
            />
          </InputGroup>
        )}

        {mode === 'segments' && (
          <DateFilter
            value={dateState}
            segments={segments}
            onChange={onFiltersChange}
          />
        )}

        {mode === 'segments' && (
          <InputGroup>
            <InputGroup.Text>Источник</InputGroup.Text>
            <Form.Select
              value={filters.source}
              onChange={({ target }) => onFiltersChange({ source: target.value })}
            >
              <option value="any">Любой</option>
              {Object.entries(t.sources).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Form.Select>
          </InputGroup>
        )}

        {mode === 'games' && (
          <InputGroup>
            <InputGroup.Text>Категория</InputGroup.Text>
            <Form.Select
              value={filters.category}
              onChange={({ target }) => onFiltersChange({ category: target.value })}
            >
              {Object.entries(filteredCategories).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Form.Select>
          </InputGroup>
        )}

        <div className="sidebar-header">Результаты</div>

        <InputGroup>
          <InputGroup.Text>Сортировка</InputGroup.Text>
          <Form.Select
            value={sorting.sortBy}
            onChange={({ target }) => onSortingChange({ sortBy: target.value })}
          >
            {SORT_OPTIONS[mode].map((key) => (
              <option key={key} value={key}>{t.sortModes[key]}</option>
            ))}
          </Form.Select>
          <Button
            variant="dark"
            onClick={() => onSortingChange({ isDesc: !sorting.isDesc })}
          >
            <FAIcon icon={SORT_ICONS[direction]} />
          </Button>
        </InputGroup>

        <Form.Group className="d-flex align-items-baseline">
          <Form.Label>Количество:</Form.Label>
          <ButtonGroup className="ms-2 flex-1-0-0">
            {[10, 25, 50, 100].map((x) => (
              <Button
                key={x}
                size="sm"
                variant={x === sorting.limit ? 'primary' : 'dark'}
                onClick={() => onSortingChange({ limit: x })}
              >
                {x}
              </Button>
            ))}
          </ButtonGroup>
        </Form.Group>
      </div>

      <div className="collapsed-content">
        <div className="sidebar-header">Фильтры</div>
        <div className="sidebar-header">Результаты</div>
      </div>
    </>
  );
};

ControlPanel.propTypes = {
  mode: PropTypes.string.isRequired,
  filters: PropTypes.shape({
    q: PropTypes.string,
    category: PropTypes.string,
    watched: PropTypes.bool,
    scale: PropTypes.oneOf(SCALES),
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
    source: PropTypes.oneOf(['any', ...SOURCES]),
  }).isRequired,
  sorting: PropTypes.shape({
    sortBy: PropTypes.string,
    isDesc: PropTypes.bool,
    limit: PropTypes.number,
  }).isRequired,

  segments: PropTypes.object,
  categories: PropTypes.object,

  onModeChange: PropTypes.func.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  onSortingChange: PropTypes.func.isRequired,
};

ControlPanel.defaultProps = {
  segments: null,
  categories: null,
};

export default ControlPanel;
