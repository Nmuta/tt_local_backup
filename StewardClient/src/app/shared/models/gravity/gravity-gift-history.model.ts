import { GiftIdentityAntecedent } from '@shared/constants';
import { GravityGift } from './gravity-gift.model';

/** Interface for Gravity gift history. */
export interface GravityGiftHistory {
  idType: GiftIdentityAntecedent;
  id: string;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: GravityGift;
  requestingAgent: string;
}
