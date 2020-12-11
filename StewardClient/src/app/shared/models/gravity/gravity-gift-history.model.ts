import { GravityPlayerInventory } from './gravity-player-inventory.model';

/** Interface for gravity player details. */
export interface GravityGiftHistory {
  playerId: string;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: GravityPlayerInventory;
}
