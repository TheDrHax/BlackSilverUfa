/* eslint-disable no-undef */
import { pluralize, renderTemplate } from './text-utils';

describe('pluralize', () => {
  test('negative', () => {
    [1, 2, 5].forEach((i) => {
      expect(pluralize(-i, [0, 1, 2])).toEqual(pluralize(i, [0, 1, 2]));
    });
  });

  test('151', () => {
    expect(pluralize(151, [0, 1, 2])).toEqual(0);
  });

  test('empty', () => {
    expect(pluralize(0)).toEqual('');
  });
});

describe('render template', () => {
  test('no placeholders', () => {
    expect(renderTemplate('test')).toEqual('test');
  });
});
