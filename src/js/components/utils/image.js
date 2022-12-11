import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const Image = React.forwardRef(({ src, fallback, ...otherProps }, ref) => {
  const [isError, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      ref={ref}
      {...otherProps}
      src={isError ? fallback : src}
      onError={isError ? null : (() => setError(true))}
    />
  );
});

Image.propTypes = {
  src: PropTypes.string.isRequired,
  fallback: PropTypes.string,
};

Image.defaultProps = {
  fallback: '/static/images/no-preview.png',
};
