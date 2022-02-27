import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FAIcon = React.forwardRef((props, ref) => (
  <FontAwesomeIcon forwardedRef={ref} {...props} />
));

export { FAIcon };
