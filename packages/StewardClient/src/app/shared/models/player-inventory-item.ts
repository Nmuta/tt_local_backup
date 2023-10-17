import { DateTime } from 'luxon';
import { MasterInventoryItem } from './master-inventory-item';
import { GuidLikeString } from './extended-types';
import BigNumber from 'bignumber.js';
import { PlayerInventoryItemListEntry } from './master-inventory-item-list';

/** Interface for a player inventory car item. */
export interface SteelheadPlayerInventoryCarItem extends PlayerInventoryItem {
  vin: GuidLikeString;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
  currentLevel: BigNumber;
  experiencePoints: BigNumber;
  carPointsTotal: BigNumber;
  flags: BigNumber;
  inventoryItemSource: SteelheadInventoryItemSource;
  acquisitionType: SteelheadItemAcquisitionType;
  clientCarInfo: BigNumber[];
  purchasePrice: BigNumber;
  entitlementId: string;
  tiersAchieved: BigNumber[];

  // Unused properties (for now). We hold references to the data to pass back to LSP
  lastUsedTime: DateTime;
  collectorScore: BigNumber;
  productionNumber: BigNumber;
  isOnlineOnly: boolean;
  unredeemed: boolean;
  baseCost: BigNumber;
  carId: BigNumber;
  purchaseTimestamp: DateTime;
}

/** List of Steelhead item acquisition types. */
export enum SteelheadItemAcquisitionType {
  NA = 'NA',
  Gift = 'Gift',
  PDLC = 'PDLC',
  ForzaFaithful = 'ForzaFaithful',
  Reward = 'Reward',
  ShowroomPurchase = 'ShowroomPurchase',
}

/** List of Steelhead inventory item sources. */
export enum SteelheadInventoryItemSource {
  Unknown = 'Unknown',
  MicrosoftStore = 'MicrosoftStore',
  Steam = 'Steam',
  Steward = 'Steward',
  Gameplay = 'Gameplay',
  Gift = 'Gift',
  Debug = 'Debug',
  DriverProgression = 'DriverProgression',
  CarProgression = 'CarProgression',
  ForzaFaithful = 'ForzaFaithful',
  FirstCarSelect = 'FirstCarSelect',
}

/** List of Woodstock inventory item sources. */
export enum WoodstockInventoryItemSource {
  Unknown = 'Unknown',
  Gameplay = 'Gameplay',
  Gift = 'Gift',
  PlayFabUserInventory = 'PlayFabUserInventory',
  Auction = 'Auction',
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
): SteelheadPlayerInventoryCarItem {
  // Strip out all the list entry extras
  listEntry.warnings = undefined;
  listEntry.isInEditMode = undefined;
  listEntry.editFormGroup = undefined;
  listEntry.editFormControls = undefined;
  listEntry.editMonitor = undefined;
  listEntry.deleteMonitor = undefined;

  return listEntry as SteelheadPlayerInventoryCarItem;
}
