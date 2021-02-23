import { SunriseGift } from './sunrise-gift.model';

/** Interface for Sunrise gift history. */
export interface SunriseGiftHistory {
  idType: string;
  id: BigInt;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: SunriseGift;
  requestingAgent: string;
}
