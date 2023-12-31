import { GuidLikeString } from '@models/extended-types';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { SunriseGift } from './sunrise-gift.model';

/** Interface for Sunrise gift history. */
export interface SunriseGiftHistory {
  idType: GiftIdentityAntecedent;
  id: BigNumber;
  title: 'sunrise';
  giftSendDateUtc: DateTime;
  giftInventory: SunriseGift;
  requesterObjectId: GuidLikeString;
}
