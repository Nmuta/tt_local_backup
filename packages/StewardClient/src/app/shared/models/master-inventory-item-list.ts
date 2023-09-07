import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { MasterInventoryItem } from './master-inventory-item';
import { PlayerInventoryCarItem, PlayerInventoryItem } from './player-inventory-item';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { InventoryItemListDisplayComponentContract } from '@views/inventory-item-list-display/inventory-item-list-display.component';

/** Represents a warning symbol to display next to a warning */
export interface ItemWarning {
  text: string;
  icon: string;
  color: 'warn' | 'primary' | 'accent';
}

/** Augmentations for player inventory item list. */
export interface PlayerInventoryItemListEntryExtras {
  warnings?: ItemWarning[];
  isInEditMode?: boolean;
  editFormGroup?: UntypedFormGroup;
  editFormControls?: { [key: string]: AbstractControl };
  editMonitor?: ActionMonitor;
  deleteMonitor?: ActionMonitor;
}

/** Composite type for player inventory item list */
export type PlayerInventoryItemListEntry = (
  | PlayerInventoryCarItem
  | PlayerInventoryItem
  | MasterInventoryItem
) &
  PlayerInventoryItemListEntryExtras;

/** Interface for a player inventory item list. */
export interface PlayerInventoryItemList {
  title: string;
  description: string;
  items: PlayerInventoryItemListEntry[];
}

/** Interface for a player inventory item list. */
export type PlayerInventoryItemListWithService = PlayerInventoryItemList & {
  service: InventoryItemListDisplayComponentContract;
};
