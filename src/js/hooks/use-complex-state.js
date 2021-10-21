import { useCallback, useState } from 'react';

export const useComplexState = (initValue) => {
  const [value, setValue] = useState(initValue);

  const changeState = useCallback((input) => setValue((current) => ({ ...current, ...input })), []);
  return [value, changeState];
};
