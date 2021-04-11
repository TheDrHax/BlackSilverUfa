export const interpolate = (input, params) => input.replace(/\{\{\w+\}\}/g, (placeholder) => {
  const key = placeholder.replaceAll(/\{\{(\w+)\}\}/g, '$1');
  return (params[key] || placeholder);
});
