import MatomoTracker from '@datapunt/matomo-tracker-js';
import config from '../../config/config.json';

const Matomo = new MatomoTracker(config.matomo);

export default Matomo;
