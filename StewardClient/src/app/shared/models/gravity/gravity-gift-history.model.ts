import { GiftIdentityAntecedent } from '@shared/constants';
import { GravityPlayerInventory } from './gravity-player-inventory.model';
import { GravityGift } from './gravity-gift.model';

/** Interface for gravity player details. */
export interface GravityGiftHistory {
  idType: GiftIdentityAntecedent;
  id: string;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: GravityGift;
  requestingAgent: string;
}
