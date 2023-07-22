/* eslint-disable no-undef */
import { ptime, ftime } from './time-utils';

describe('ptime/ftime', () => {
  test('parse', () => {
    expect(ptime('1')).toEqual(1);
    expect(ptime('1:00')).toEqual(60);
    expect(ptime('1:00:00')).toEqual(3600);
    expect(ptime('-1')).toEqual(-1);
    expect(ptime('-1:00')).toEqual(-60);
    expect(ptime('-1:00:00')).toEqual(-3600);
  });

  test('format', () => {
    expect(ftime(1)).toEqual('0:01');
    expect(ftime(60)).toEqual('1:00');
    expect(ftime(3600)).toEqual('1:00:00');
    expect(ftime(-1)).toEqual('-0:01');
    expect(ftime(-60)).toEqual('-1:00');
    expect(ftime(-3600)).toEqual('-1:00:00');
  });
});
