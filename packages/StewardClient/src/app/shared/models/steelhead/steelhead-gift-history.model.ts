import { GuidLikeString } from '@models/extended-types';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { SteelheadGift } from './steelhead-gift.model';

/** Interface for Steelhead gift history. */
export interface SteelheadGiftHistory {
  idType: GiftIdentityAntecedent;
  id: BigNumber;
  title: 'Steelhead';
  giftSendDateUtc: DateTime;
  giftInventory: SteelheadGift;
  requesterObjectId: GuidLikeString;
}
