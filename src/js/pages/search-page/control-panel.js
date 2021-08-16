import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Select from './select';
import Dropdown from './dropdown';
import DateFilter from './date-filter';
import TextFilter from './text-filter';
// Namespace
import { searchPage as t } from '../../constants/texts';
import { MODES } from './constants';

const SORT_OPTIONS = {
  segments: ['date'],
  games: ['date', 'stream_count'],
};

const SORT_ICONS = {
  desc: 'fa-sort-amount-down',
  asc: 'fa-sort-amount-up',
};

const STYLE_CONFIG = {
  xs: 12,
  sm: 8,
  md: 6,
  lg: 4,
};

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

  return (
    <Row className="interactive-search-form">
      <Col>
        <Card className="w-100 h-0 pl-3 pr-3 pt-3 pb-2">
          <Form>
            <InputGroup>
              <InputGroup.Prepend>
                <Dropdown
                  value={mode}
                  options={MODES}
                  variant="success"
                  labels={t.modes}
                  onChange={(input) => {
                    onModeChange(input);
                    onSortingChange({ sortBy: 'date' });
                  }}
                />
              </InputGroup.Prepend>
              <TextFilter onSubmit={(input) => onFiltersChange({ text: input })} />
            </InputGroup>
            <Form.Row>
              {mode === 'segments'
                ? (
                  <DateFilter
                    {...STYLE_CONFIG}
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    segments={segments}
                    onChange={onFiltersChange}
                  />
                )
                : (
                  <Select
                    {...STYLE_CONFIG}
                    value={filters.category}
                    label={t.category}
                    labels={categories}
                    options={Object.keys(categories)}
                    onChange={(category) => onFiltersChange({ category })}
                  />
                )}
              <Select
                {...STYLE_CONFIG}
                value={sorting.sortBy}
                label={t.sorting}
                labels={t.sortModes}
                options={SORT_OPTIONS[mode]}
                iconClassName={SORT_ICONS[direction]}
                onIconClick={() => onSortingChange({ isDesc: !sorting.isDesc })}
                onChange={(input) => onSortingChange({ sortBy: input })}
              />
            </Form.Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

ControlPanel.propTypes = {
  mode: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  sorting: PropTypes.object.isRequired,
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
