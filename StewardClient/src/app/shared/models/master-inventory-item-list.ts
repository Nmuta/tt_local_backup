import { MasterInventoryItem } from './master-inventory-item';
import { PlayerInventoryItem } from './player-inventory-item';

/** Represents a warning symbol to display next to a warning */
export interface ItemWarning {
  text: string;
  icon: string;
  color: 'warn' | 'primary' | 'accent';
}

/** Augmentations for player inventory item list. */
export interface PlayerInventoryItemListEntryExtras {
  warnings?: ItemWarning[];
}

/** Composite type for player inventory item list */
export type PlayerInventoryItemListEntry = (PlayerInventoryItem | MasterInventoryItem) &
  PlayerInventoryItemListEntryExtras;

/** Interface for a player inventory item list. */
export interface PlayerInventoryItemList {
  title: string;
  description: string;
  items: PlayerInventoryItemListEntry[];
}
