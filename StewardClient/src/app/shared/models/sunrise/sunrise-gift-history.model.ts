import { SunrisePlayerInventory } from './sunrise-player-inventory.model';

/** Interface for Sunrise gift history. */
export interface SunriseGiftHistory {
  idType: string;
  id: BigInt;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: SunrisePlayerInventory;
  requestingAgent: string;
}
