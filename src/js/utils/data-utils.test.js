/* eslint-disable no-undef */
import { Data } from '../data';
import {
  getOffset,
  getAbsTime,
  getRelTime,
  getBaseSegment,
  resolveSegment,
  resolveGame,
  getGameDescription,
} from './data-utils';

describe('offset', () => {
  test('simple', () => {
    expect(getOffset({ abs_start: 0 }, 60))
      .toEqual(0);
  });

  test('abs_start', () => {
    expect(getOffset({ abs_start: 60 }, 60))
      .toEqual(60);
  });

  test('cuts', () => {
    expect(getOffset({ abs_start: 0, cuts: [[10, 40], [60, 90]] }, 300))
      .toEqual(60);
  });

  test('abs_start + cuts (full)', () => {
    expect(getOffset({ abs_start: 60, cuts: [[60, 90]] }, 90))
      .toEqual(60 + 30);
  });

  test('abs_start + cuts (cut out)', () => {
    expect(getOffset({ abs_start: 60, cuts: [[60, 90]] }, 75))
      .toEqual(60);
  });

  test('abs_start + cuts (excluded)', () => {
    expect(getOffset({ abs_start: 60, cuts: [[30, 60]] }, 60))
      .toEqual(60);
  });

  test('abs_start + cuts (partially excluded)', () => {
    expect(getOffset({ abs_start: 45, cuts: [[30, 60]] }, 60))
      .toEqual(45 + 15);
  });

  test('two-way time transform with cuts', () => Data.then(({ segments }) => {
    const segment = segments.by('segment', '1218281049,1218409784');
    [5000, 6000, 8000, 13000, 19000].map((at) => (
      expect(getAbsTime(getRelTime(at, segment), segment)).toEqual(at)
    ));
  }));
});

describe('base segment', () => {
  test('primary', () => Data.then(({ segments }) => {
    expect(getBaseSegment(segments.by('segment', '524415764'), 0))
      .toMatchObject(['524415764', 0, 0]);
  }));

  test('primary with cuts', () => Data.then(({ segments }) => {
    expect(getBaseSegment(segments.by('segment', '827759529'), 20847))
      .toMatchObject(['827759529', 20941, 20847]);
  }));

  test('primary with cuts (unaffected)', () => Data.then(({ segments }) => {
    expect(getBaseSegment(segments.by('segment', '827759529'), 16000))
      .toMatchObject(['827759529', 16000, 16000]);
  }));

  test('primary with cuts and source cuts', () => Data.then(({ segments }) => {
    expect(getBaseSegment(segments.by('segment', '1594431864'), 17013))
      .toMatchObject(['1594431864', 17013 + 515 /* + 30 */, 17013]);
  }));

  test('secondary', () => Data.then(({ segments }) => {
    expect(getBaseSegment(segments.by('segment', '306956427.1'), 0))
      .toMatchObject(['306956427', 9273, 0]);
  }));

  test('joined', () => Data.then(({ segments }) => {
    expect(getBaseSegment(segments.by('segment', '728972501,729152253'), 0))
      .toMatchObject(['728972501', 0, 0]);
  }));

  test('joined with offset', () => Data.then(({ segments }) => {
    expect(getBaseSegment(segments.by('segment', '775167526,776153173'), 0))
      .toMatchObject(['775167526', 18074, 18074]);
  }));

  test('joined with offset and time', () => Data.then(({ segments }) => {
    expect(getBaseSegment(segments.by('segment', '775167526,776153173'), 3600))
      .toMatchObject(['775167526', 3600 + 18074, 3600 + 18074]);
  }));

  test('joined with offset and time 2', () => Data.then(({ segments }) => {
    expect(getBaseSegment(segments.by('segment', '775167526,776153173'), 18000))
      .toMatchObject(['776153173', 18000 - 15550, 18000 - 15550]);
  }));
});

describe('resolve segment', () => {
  test('missing', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '4221', undefined))
      .toMatchObject([null]);
  }));

  test('primary', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '524415764', undefined))
      .toMatchObject([{ segment: '524415764' }, undefined, undefined]);
  }));

  test('primary with time', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '524415764', 3600))
      .toMatchObject([{ segment: '524415764' }, 3600, 3600]);
  }));

  test('secondary', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '225279322.1', undefined))
      .toMatchObject([{ segment: '225279322.1' }, undefined, undefined]);
  }));

  test('from secondary to primary', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '325559385.1', undefined))
      .toMatchObject([{ segment: '325559385' }, undefined, undefined]);
  }));

  test('joined', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '728972501,729152253', undefined))
      .toMatchObject([{ segment: '728972501,729152253' }, undefined, undefined]);
  }));

  test('from primary to joined (1)', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '728972501', undefined))
      .toMatchObject([{ segment: '728972501,729152253' }, 0, 0]);
  }));

  test('from primary to joined (2)', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '729152253', undefined))
      .toMatchObject([{ segment: '728972501,729152253' }, 18340, 18340]);
  }));

  test('from primary to joined (2) with time', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '729152253', 3600))
      .toMatchObject([{ segment: '728972501,729152253' }, 18340 + 3600, 18340 + 3600]);
  }));

  test('from joined to primary', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '306581403,306956427', 0))
      .toMatchObject([{ segment: '306581403' }, 730, 0]);
  }));

  test('from joined to missing', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '1224,4221', undefined))
      .toMatchObject([null]);
  }));

  test('from joined to partially missing (1)', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '306581403,4221', undefined))
      .toMatchObject([{ segment: '306581403' }, 730, 0]);
  }));

  test('from joined to partially missing (2)', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '4221,306581403', undefined))
      .toMatchObject([{ segment: '306581403' }, 730, 0]);
  }));

  test('from joined to primary with time', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '306581403,306956427', 3600))
      .toMatchObject([{ segment: '306581403' }, 730, 0]);
  }));

  test('time out of bounds (left)', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '290597816.1', 10000))
      .toMatchObject([{ segment: '290597816' }, 10000, 10007]);
  }));

  test('time out of bounds (right)', () => Data.then(({ segments }) => {
    expect(resolveSegment(segments, '290597816', 13000))
      .toMatchObject([{ segment: '290597816.1' }, 13000, 13000 - 12382]);
  }));
});

describe('resolve game', () => {
  test('one game, primary segment', () => Data.then(({ games, segments }) => {
    expect(resolveGame(games, segments.by('segment', '001508180'), null))
      .toMatchObject([{ id: 'zombi' }, { name: '1' }]);
  }));

  test('one game, secondary segment', () => Data.then(({ games, segments }) => {
    expect(resolveGame(games, segments.by('segment', '288630615.1'), 6237))
      .toMatchObject([{ id: 'no-mans-sky' }, { name: '1 (с Джеком)' }]);
  }));

  test('secondary segment, first ref with start', () => Data.then(({ games, segments }) => {
    expect(resolveGame(games, segments.by('segment', '343098113.1'), null))
      .toMatchObject([{ id: 'co-op' }, { name: 'Superfighters Deluxe' }]);
  }));

  test('multiple games', () => Data.then(({ games, segments }) => {
    expect(resolveGame(games, segments.by('segment', '287810258'), 0))
      .toMatchObject([{ id: 'charity' }, { name: '2' }]);

    expect(resolveGame(games, segments.by('segment', '287810258'), 12000))
      .toMatchObject([{ id: 'immortal-redneck' }, { name: '3' }]);
  }));

  test('subref match', () => Data.then(({ games, segments }) => {
    expect(resolveGame(games, segments.by('segment', '275418948'), 11000))
      .toMatchObject([{ id: 'first-2018' }, { name: 'Sinner / Trigger' }]);
  }));
});

describe('game description', () => {
  test('without refs', () => {
    expect(getGameDescription({ streams: [] }))
      .toEqual('0 стримов');
  });

  test('1 ref', () => {
    expect(getGameDescription({
      streams: [{
        segment: '123',
        original: { date: new Date('2021-01-01') },
      }],
    })).toEqual('1 стрим 01.01.2021');
  });

  test('streams = refs', () => Data.then(({ games }) => {
    expect(getGameDescription(games.by('id', 'observation')))
      .toEqual('2 стрима с 21.05.2019 по 23.05.2019');
  }));

  test('streams < refs', () => Data.then(({ games }) => {
    expect(getGameDescription(games.by('id', 'spider-man')))
      .toEqual('4 стрима с 06.09.2018 по 24.10.2018');
  }));
});
