import { GuidLikeString } from '@models/extended-types';
import { GiftIdentityAntecedent } from '@shared/constants';
import { GravityGift } from './gravity-gift.model';

/** Interface for Gravity gift history. */
export interface GravityGiftHistory {
  idType: GiftIdentityAntecedent;
  id: string;
  title: 'gravity';
  giftSendDateUtc: Date;
  giftInventory: GravityGift;
  requesterObjectId: GuidLikeString;
}
