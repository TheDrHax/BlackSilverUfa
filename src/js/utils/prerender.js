export const isPrerender = navigator.userAgent.toLowerCase().indexOf('prerender') !== -1;

export const NoPrerender = ({ children }) => !isPrerender && children;
