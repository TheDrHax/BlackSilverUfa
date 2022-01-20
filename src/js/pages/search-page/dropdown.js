import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Dropdown } from 'react-bootstrap';

const DropdownComponent = ({ value, variant, onChange, options, labels }) => (
  <Dropdown>
    <Dropdown.Toggle variant={variant}>
      {labels[value]}
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {options.map((current) => (
        <Dropdown.Item
          key={current}
          active={value === current}
          onClick={() => onChange(current)}
        >
          {labels[current]}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

DropdownComponent.propTypes = {
  value: PropTypes.string,
  variant: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  labels: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

DropdownComponent.defaultProps = {
  value: null,
  variant: null,
};

export default DropdownComponent;
