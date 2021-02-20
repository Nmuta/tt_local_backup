import { SunriseGift } from './sunrise-gift.model';

/** Interface for an Apollo group gift. */
export interface SunriseGroupGift extends SunriseGift {
  xuids: bigint[];
}
