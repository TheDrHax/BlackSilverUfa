/* eslint-disable no-undef */
import fts from './full-text-search';

const data = [
  { id: 1, name: 'SnowRunner #5 / Xbox Inside 2020' },
  { id: 2, name: 'Ghost of Tsushima - Прохождение' },
  { id: 3, name: 'Pummel Party #10 (7D) / Human: Fall Flat #9' },
  { id: 4, name: 'Первый взгляд 2020' },
  { id: 5, name: 'Half-Life 3' },
  { id: 6, name: 'Shenmue III' },
];

test('lowercase', () => {
  expect(fts('snowrunner', data, (x) => x.name))
    .toMatchObject([{ id: 1 }]);
});

test('mixed case', () => {
  expect(fts('Ghost', data, (x) => x.name))
    .toMatchObject([{ id: 2 }]);
});

test('symbols only', () => {
  expect(fts('/', data, (x) => x.name))
    .toMatchObject([]);
});

test('text with symbols', () => {
  expect(fts('Party #10', data, (x) => x.name))
    .toMatchObject([{ id: 3 }]);
});

test('multiple matches', () => {
  expect(fts('2020', data, (x) => x.name))
    .toMatchObject([{ id: 1 }, { id: 4 }]);
});

test('rank filter', () => {
  expect(fts('xbox 2020', data, (x) => x.name))
    .toMatchObject([{ id: 1 }]);
});

test('without lambda', () => {
  expect(fts('2020', ['2019', '2020', '2021']))
    .toMatchObject(['2020']);
});

test('empty text', () => {
  expect(fts('', data, (x) => x.name))
    .toMatchObject([]);

  expect(fts(null, data, (x) => x.name))
    .toMatchObject([]);
});

test('filter number-only matches', () => {
  expect(fts('shenmue 3', data, (x) => x.name))
    .toMatchObject([{ id: 6 }]);
});
