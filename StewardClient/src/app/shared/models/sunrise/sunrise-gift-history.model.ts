import { GiftIdentityAntecedent } from '@shared/constants';
import { SunrisePlayerInventory } from './sunrise-player-inventory.model';
import { SunriseGift } from './sunrise-gift.model';

/** Interface for Sunrise gift history. */
export interface SunriseGiftHistory {
  idType: GiftIdentityAntecedent;
  id: BigInt;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: SunriseGift;
  requestingAgent: string;
}
