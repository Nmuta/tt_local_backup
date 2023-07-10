import { DateTime } from 'luxon';
import { MasterInventoryItem } from './master-inventory-item';
import { GuidLikeString } from './extended-types';
import BigNumber from 'bignumber.js';
import { PlayerInventoryItemListEntry } from './master-inventory-item-list';

/** Interface for a player inventory car item. */
export interface PlayerInventoryCarItem extends PlayerInventoryItem {
  vin: GuidLikeString;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
  currentLevel: BigNumber;
  experiencePoints: BigNumber;
  flags: BigNumber;
  clientCarInfo: BigNumber[];
  purchasePrice: BigNumber;
  entitlementId: string;
  tiersAchieved: BigNumber[];
}

/** Interface for a player inventory item. */
export interface PlayerInventoryItem extends MasterInventoryItem {
  acquiredUtc?: DateTime;
}

/** Returns true if item is a player's inventory item. */
export function isPlayerInventoryItem(item: PlayerInventoryItem | MasterInventoryItem): boolean {
  return (item as PlayerInventoryItem).acquiredUtc !== undefined;
}

/** Converts player inventory item list entry to a player inventory car item. */
export function toPlayerInventoryCarItem(
  listEntry: PlayerInventoryItemListEntry,
): PlayerInventoryCarItem {
  // Strip out all the list entry extras
  listEntry.warnings = undefined;
  listEntry.isInEditMode = undefined;
  listEntry.editFormGroup = undefined;
  listEntry.editFormControls = undefined;
  listEntry.editMonitor = undefined;
  listEntry.deleteMonitor = undefined;

  return listEntry as PlayerInventoryCarItem;
}
