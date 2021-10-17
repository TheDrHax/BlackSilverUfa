import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Components
import { Button, Form, InputGroup } from 'react-bootstrap';
// Namespace
import { searchPage as t } from '../../constants/texts';

const ENTER_KEYS = ['NumpadEnter', 'Enter'];

const TextFilter = ({ onSubmit }) => {
  const [value, setValue] = useState('');

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
      <InputGroup.Append>
        <Button variant="primary" onClick={() => onSubmit(value)}>{t.search}</Button>
      </InputGroup.Append>
    </>
  );
};

TextFilter.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default TextFilter;
