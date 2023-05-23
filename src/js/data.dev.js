import cloneDeep from 'lodash/cloneDeep';
import segments from '../../_site/data/segments.json';
import games from '../../_site/data/games.json';
import categories from '../../_site/data/categories.json';
import timecodes from '../../_site/data/timecodes.json';
import Persist from './data-persist';

export default async function load() {
  return [
    cloneDeep(segments),
    cloneDeep(categories),
    cloneDeep(games),
    await Persist,
    (async () => cloneDeep(timecodes))(),
  ];
}
