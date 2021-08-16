import React from 'react';
import PropTypes, { string } from 'prop-types';
// Components
import { Button, Col, Form, InputGroup } from 'react-bootstrap';

const Select = ({ value, label, options, labels, onChange, iconClassName, onIconClick, ...rest }) => (
  <InputGroup as={Col} {...rest}>
    <InputGroup.Prepend>
      <InputGroup.Text>{label}:</InputGroup.Text>
    </InputGroup.Prepend>
    <Form.Control
      as="select"
      custom
      value={value}
      onChange={({ target }) => onChange(target.value)}
    >
      {options.map((key) => (
        <option key={key} value={key}>{labels[key]}</option>
      ))}
    </Form.Control>
    {!!iconClassName && (
    <InputGroup.Append>
      <Button
        variant="dark"
        onClick={onIconClick}
      >
        <i className={`fas ${iconClassName}`} />
      </Button>
    </InputGroup.Append>
    )}
  </InputGroup>
);

Select.propTypes = {
  value: PropTypes.string,
  iconClassName: PropTypes.string,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(string),
  labels: PropTypes.object,
  onChange: PropTypes.func,
  onIconClick: PropTypes.func,
};

Select.defaultProps = {
  value: null,
  iconClassName: null,
  options: [],
  labels: {},
  onChange: () => {},
  onIconClick: null,
};

export default Select;
