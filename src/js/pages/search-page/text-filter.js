import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { searchPage as t } from '../../constants/texts';
import { FAIcon } from '../../utils/fontawesome';

const ENTER_KEYS = ['NumpadEnter', 'Enter'];

const TextFilter = ({ initValue, onSubmit }) => {
  const [value, setValue] = useState(initValue);

  const handleKeyPress = (event) => {
    if (!ENTER_KEYS.includes(event.key)) return;

    event.preventDefault();
    onSubmit(value);
  };

  useEffect(() => {
    if (initValue !== value) {
      setValue(initValue);
    }
  }, [initValue]);

  return (
    <InputGroup>
      <Form.Control
        type="text"
        value={value}
        placeholder={t.queryPlaceholder}
        onChange={({ target }) => setValue(target.value)}
        onKeyPress={handleKeyPress}
      />
      {value.length > 0 && (
        <Button
          variant="danger"
          onClick={() => {
            setValue('');
            onSubmit('');
          }}
        >
          <FAIcon icon={faTimes} />
        </Button>
      )}
      <Button variant="primary" onClick={() => onSubmit(value)}>{t.search}</Button>
    </InputGroup>
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
