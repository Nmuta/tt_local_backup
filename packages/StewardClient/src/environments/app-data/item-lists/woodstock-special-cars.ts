import { BigNumber } from 'bignumber.js';

/** List of Woodstock Car Ids which should not be automatically gifted when restoring an inventory profile.*/
export const WOODSTOCK_UNIQUE_CAR_IDS = [
  new BigNumber(1269),
  new BigNumber(1564),
  new BigNumber(1332),
  new BigNumber(483),
  new BigNumber(249),
  new BigNumber(1023),
  new BigNumber(3183),
  new BigNumber(1581),
  new BigNumber(2614),
  new BigNumber(2613),
  new BigNumber(3287),
  new BigNumber(260),
  new BigNumber(3261),
  new BigNumber(2636),
];

/** Quick lookup set for Woodstock Car Ids which should not be automatically gifted when restoring an inventory profile. */
export const WOODSTOCK_UNIQUE_CAR_IDS_LOOKUP = new Set(
  WOODSTOCK_UNIQUE_CAR_IDS.map(id => id.toString()),
);
