import BigNumber from 'bignumber.js';
import { SteelheadGift } from './steelhead-gift.model';

/** Interface for an Steelhead group gift. */
export interface SteelheadGroupGift extends SteelheadGift {
  xuids: BigNumber[];
}
