import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Components
import { Button, Form } from 'react-bootstrap';
// Namespace
import { searchPage as t } from '../../constants/texts';

const ENTER_KEYS = ['NumpadEnter', 'Enter'];

const TextFilter = ({ initValue, onSubmit }) => {
  const [value, setValue] = useState(initValue);

  const handleKeyPress = (event) => {
    if (!ENTER_KEYS.includes(event.code)) return;

    event.preventDefault();
    onSubmit(value);
  };

  return (
    <>
      <Form.Control
        type="text"
        value={value}
        placeholder={t.queryPlaceholder}
        onChange={({ target }) => setValue(target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button variant="primary" onClick={() => onSubmit(value)}>{t.search}</Button>
    </>
  );
};

TextFilter.propTypes = {
  initValue: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

TextFilter.defaultProps = {
  initValue: '',
};

export default TextFilter;
