/* eslint-disable no-undef */
import { ptime, ftime } from './time-utils';

describe('ptime/ftime', () => {
  test('parse', () => {
    expect(ptime('1')).toEqual(1);
    expect(ptime('1:00')).toEqual(60);
    expect(ptime('1:00:00')).toEqual(3600);
  });

  test('format and parse', () => {
    [0, 1, 60, 61, 3600, 3601, 3661].forEach((i) => {
      expect(ptime(ftime(i))).toEqual(i);
    });
  });
});
