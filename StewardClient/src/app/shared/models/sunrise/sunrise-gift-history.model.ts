import { SunrisePlayerInventory } from './sunrise-player-inventory.model';

/** Interface for Sunrise gift history. */
export interface SunriseGiftHistory {
  playerId: string;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: SunrisePlayerInventory;
}

/** LiveOps model for multiple ban descriptions. */
export type SunriseGiftHistories = SunriseGiftHistory[];
