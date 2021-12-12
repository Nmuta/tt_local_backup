import BigNumber from 'bignumber.js';

/** Model for a single player gift. */
export interface Gift {
  giftReason: string;
}

/** Model for a multi-player gift. */
export interface GroupGift extends Gift {
  xuids: BigNumber[];
}
