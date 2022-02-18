import { useMediaQuery } from 'react-responsive';

export const useBreakpoints = () => ({
  xs: useMediaQuery({ maxWidth: 575 }),
  sm: useMediaQuery({ minWidth: 576, maxWidth: 767 }),
  md: useMediaQuery({ minWidth: 768, maxWidth: 991 }),
  lg: useMediaQuery({ minWidth: 992, maxWidth: 1199 }),
  xl: useMediaQuery({ minWidth: 1200, maxWidth: 1399 }),
  xxl: useMediaQuery({ minWidth: 1400 }),
});

export const useBreakpointIndex = () => Object.values(useBreakpoints()).indexOf(true);

export const useResponsiveValue = (values = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']) => (
  values[Math.min(values.length - 1, useBreakpointIndex())]
);
