import { DateTime } from 'luxon';
import { MasterInventoryItem } from './master-inventory-item';
import { GuidLikeString } from './extended-types';
import BigNumber from 'bignumber.js';

/** Interface for a player inventory car item. */
export interface PlayerInventoryCarItem extends PlayerInventoryItem {
  vin: GuidLikeString;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
  currentLevel: BigNumber;
  experiencePoints: BigNumber;
}

/** Interface for a player inventory item. */
export interface PlayerInventoryItem extends MasterInventoryItem {
  acquiredUtc?: DateTime;
}

export function isPlayerInventoryItem(item: PlayerInventoryItem | MasterInventoryItem): boolean {
  return (item as PlayerInventoryItem).acquiredUtc !== undefined;
}
