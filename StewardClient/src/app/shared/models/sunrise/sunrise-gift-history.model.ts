import { SunrisePlayerInventory } from './sunrise-player-inventory.model';

/** Interface for Sunrise gift history. */
export interface SunriseGiftHistory {
  idType: string;
  id: string;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: SunrisePlayerInventory;
  requestingAgent: string;
}

/** LiveOps model for multiple gift history descriptions. */
export type SunriseGiftHistories = SunriseGiftHistory[];
