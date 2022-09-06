import BigNumber from 'bignumber.js';

/** Model for a single player gift. */
export interface Gift {
  giftReason: string;
}

/** Model for a multi-player gift. */
export interface GroupGift extends Gift {
  xuids: BigNumber[];
}

/** Model for a multi-livery gift. */
export interface BulkLiveryGift<TTarget> {
  liveryIds: string[];
  target: TTarget;
}

/** Model for multi-player multi-livery gift. */
export type BulkPlayerBulkLiveryGift = BulkLiveryGift<GroupGift>;
