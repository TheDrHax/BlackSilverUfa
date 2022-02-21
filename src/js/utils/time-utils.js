import sum from 'lodash/sum';
import reverse from 'lodash/reverse';
import range from 'lodash/range';
import padStart from 'lodash/padStart';

export const ptime = (t) => (
  sum(reverse(t.split(':')).map((x, i) => x * 60 ** i))
);

export const ftime = (t) => (
  range(2, -1, -1).map((i) => {
    const res = Math.floor(t / 60 ** i);
    t %= 60 ** i;
    return padStart(res, 2, '0');
  }).join(':')
);
