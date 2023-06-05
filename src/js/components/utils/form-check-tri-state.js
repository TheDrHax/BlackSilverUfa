import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormCheck } from 'react-bootstrap';

const values = [null, true, false];

export default function FormCheckTriState({ value, onChange, ...other }) {
  const ref = useRef();

  useEffect(() => {
    if (value == null) {
      ref.current.indeterminate = true;
    } else {
      ref.current.indeterminate = false;
      ref.current.checked = value;
    }
  }, [value]);

  return (
    <FormCheck
      {...other}
      ref={ref}
      onChange={() => {
        const next = (values.indexOf(value) + 1) % values.length;
        onChange(values[next]);
      }}
    />
  );
}

FormCheckTriState.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

FormCheckTriState.defaultProps = {
  value: null,
  onChange: () => {},
};
