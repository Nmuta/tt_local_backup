import { GravityGift } from './gravity-gift.model';

/** Interface for gravity player details. */
export interface GravityGiftHistory {
  idType: string;
  id: string;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: GravityGift;
  requestingAgent: string;
}
