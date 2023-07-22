import sum from 'lodash/sum';
import reverse from 'lodash/reverse';
import range from 'lodash/range';
import padStart from 'lodash/padStart';

export const ptime = (t) => {
  let sign = 1;

  if (t[0] === '-') {
    sign = -1;
    t = t.slice(1);
  }

  return sign * sum(reverse(t.split(':')).map((x, i) => x * 60 ** i));
};

export const ftime = (t) => {
  const sign = t < 0;
  if (sign) t = -t;

  return (sign ? '-' : '') + range(2, -1, -1).reduce((acc, cur) => {
    const res = Math.floor(t / 60 ** cur);
    if (cur === 2 && res === 0) return acc; // skip 0 hours
    t %= 60 ** cur;
    return [
      ...acc,
      acc.length > 0
        ? padStart(res, 2, '0')
        : res,
    ];
  }, []).join(':');
};
