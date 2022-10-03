import { Component, Input, OnInit } from '@angular/core';
import { MSError } from '@models/error.model';
import {
  PlayerInventoryItemList,
  PlayerInventoryItemListEntry,
} from '@models/master-inventory-item-list';
import { isPlayerInventoryItem } from '@models/player-inventory-item';

/** Helper component for display lists of master inventory items. */
@Component({
  selector: 'inventory-item-list-display',
  templateUrl: './inventory-item-list-display.component.html',
  styleUrls: ['./inventory-item-list-display.component.scss'],
})
export class InventoryItemListDisplayComponent implements OnInit {
  /** REVIEW-COMMENT: Player inventory list to show. */
  @Input() public whatToShow: PlayerInventoryItemList;
  public inventoryColumns: string[] = ['quantity', 'description', 'errors'];
  public errors: MSError[];

  /** Initialization hook. */
  public ngOnInit(): void {
    if (this.whatToShow.items.length > 0 && isPlayerInventoryItem(this.whatToShow.items[0])) {
      this.inventoryColumns.push('dateAquired');
    }

    this.errors = this.whatToShow.items.map(v => v.error).filter(error => !!error);
  }

  /** Type safety for the template. */
  public entry(input: unknown): PlayerInventoryItemListEntry {
    return input as PlayerInventoryItemListEntry;
  }
}
