import BigNumber from 'bignumber.js';
import { GuidLikeString } from './extended-types';

/** Model for a single player gift. */
export interface Gift {
  giftReason: string;
}

/** Gift with localized title and body ids. */
export interface LocalizedMessageGift extends Gift {
  titleMessageId: GuidLikeString;
  bodyMessageId: GuidLikeString;
}

/** Model for a multi-player gift. */
export interface GroupGift extends Gift {
  xuids: BigNumber[];
}

/** Group Gift with localized title and body ids. */
export interface LocalizedMessageGroupGift extends LocalizedMessageGift {
  xuids: BigNumber[];
}

/** Model for a single player gift that can expire. */
export interface ExpirableGift extends Gift {
  expireTimeSpanInDays: BigNumber;
}

/** Model for a multi-player gift that can expire. */
export interface ExpirableGroupGift extends ExpirableGift {
  xuids: BigNumber[];
}

/** A localized message single player gift that can expire. */
export interface LocalizedMessageExpirableGift extends LocalizedMessageGift {
  expireTimeSpanInDays: BigNumber;
}

/** A localized message multi-player gift that can expire. */
export interface LocalizedMessageExpirableGroupGift extends LocalizedMessageExpirableGift {
  xuids: BigNumber[];
}

/** Model for a multi-livery gift. */
export interface BulkLiveryGift<TTarget> {
  liveryIds: string[];
  target: TTarget;
}
