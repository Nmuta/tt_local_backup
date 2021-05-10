import BigNumber from 'bignumber.js';
import { WoodstockGift } from './woodstock-gift.model';

/** Interface for an Apollo group gift. */
export interface WoodstockGroupGift extends WoodstockGift {
  xuids: BigNumber[];
}
