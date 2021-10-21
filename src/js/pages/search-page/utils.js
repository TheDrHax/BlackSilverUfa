// Namespace
import { searchPage as t } from '../../constants/texts';

const getKey = (count) => {
  const key = count >= 20 ? count % 10 : count;

  if (key === 1) return 0;
  return (key > 1 && key < 5) ? 1 : 2;
};

export const getStreamsLabel = (count) => {
  const { base, endings } = t.streams;
  const key = getKey(count);

  return `${count} ${base}${endings[key]}`;
};
