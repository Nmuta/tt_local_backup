import { BigNumber } from 'bignumber.js';

/** List of Sunrise Car Ids which should not be automatically gifted when restoring an inventory profile.*/
export const SUNRISE_UNIQUE_CAR_IDS = [
  new BigNumber(1550),
  new BigNumber(633),
  new BigNumber(2976),
  new BigNumber(2980),
  new BigNumber(2981),
  new BigNumber(336),
  new BigNumber(489),
  new BigNumber(2985),
  new BigNumber(2825),
  new BigNumber(1589),
  new BigNumber(1662),
  new BigNumber(2987),
  new BigNumber(363),
  new BigNumber(2994),
  new BigNumber(296),
  new BigNumber(3253),
  new BigNumber(3207),
  new BigNumber(3208),
  new BigNumber(3210),
  new BigNumber(3209),
];

/** Quick lookup set for Sunrise Car Ids which should not be automatically gifted when restoring an inventory profile. */
export const SUNRISE_UNIQUE_CAR_IDS_LOOKUP = new Set(
  SUNRISE_UNIQUE_CAR_IDS.map(id => id.toString()),
);
