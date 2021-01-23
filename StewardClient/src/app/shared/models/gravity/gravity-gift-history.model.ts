import { GravityPlayerInventory } from './gravity-player-inventory.model';

/** Interface for gravity player details. */
export interface GravityGiftHistory {
  idType: string;
  id: string;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: GravityPlayerInventory;
}

/** LiveOps model for multiple gift history descriptions. */
export type GravityGiftHistories = GravityGiftHistory[];
