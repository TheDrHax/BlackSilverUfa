import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FAIcon = React.forwardRef((props, ref) => (
  <FontAwesomeIcon {...props} ref={ref} />
));

export { FAIcon };
