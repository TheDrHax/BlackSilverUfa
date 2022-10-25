/* eslint-disable no-undef */
import { pluralize, renderTemplate, tokenize } from './text-utils';

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

const tokenizeData = [
  ['SnowRunner #5 / Xbox Inside 2020', 'snowrunner 5 xbox inside 2020'],
  ['Ghost of Tsushima - Прохождение', 'ghost of tsushima прохождение'],
  ['ё', 'е'],
  ['Первый взгляд 2020', 'первый взгляд 2020'],
];

describe('tokenize', () => {
  test('tokenize', () => {
    tokenizeData.map(([x, y]) => expect(tokenize(x).join(' ')).toEqual(y));
  });
});
