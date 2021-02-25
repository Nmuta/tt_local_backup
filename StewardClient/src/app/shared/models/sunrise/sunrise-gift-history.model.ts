import { GiftIdentityAntecedent } from '@shared/constants';
import { SunriseGift } from './sunrise-gift.model';

/** Interface for Sunrise gift history. */
export interface SunriseGiftHistory {
  idType: GiftIdentityAntecedent;
  id: BigInt;
  title: 'sunrise';
  giftSendDateUtc: Date;
  giftInventory: SunriseGift;
  requestingAgent: string;
}
