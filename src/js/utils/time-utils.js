import { sum, reverse, range, padStart } from 'lodash';

function ptime(t) {
  return sum(reverse(t.split(':')).map((x, i) => x * 60 ** i));
}

function ftime(t) {
  return range(2, -1, -1).map((i) => {
    const res = Math.floor(t / 60 ** i);
    t %= 60 ** i;
    return padStart(res, 2, '0');
  }).join(':');
}

export { ptime, ftime };
