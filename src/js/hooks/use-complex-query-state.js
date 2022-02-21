import { useCallback } from 'react';
import { withDefault, useQueryParams } from 'use-query-params';
import flow from 'lodash/flow';
import isEqual from 'lodash/isEqual';

/**
 * Uses default value when query param is nullable and hides it from the search.
 *
 * @see {@link https://github.com/pbeshai/use-query-params/issues/138}
 */
const withSquashedDefault = (paramConfig, defaultValue) => {
  const defaulted = withDefault(paramConfig, defaultValue);

  return {
    encode: flow(
      (value) => (isEqual(value, defaultValue) ? undefined : value),
      defaulted.encode,
    ),
    decode: defaulted.decode,
  };
};

const useComplexQueryState = (schema) => {
  const [value, setValue] = useQueryParams(schema);

  const updateState = useCallback((update) => {
    setValue({ ...value, ...update });
  });

  return [value, updateState];
};

export { useComplexQueryState, withSquashedDefault };
