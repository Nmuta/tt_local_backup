import { Component, Input, OnInit } from '@angular/core';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { isPlayerInventoryItem } from '@models/player-inventory-item';

/** Helper component for display lists of master inventory items. */
@Component({
  selector: 'inventory-item-list-display',
  templateUrl: './inventory-item-list-display.component.html',
  styleUrls: ['./inventory-item-list-display.component.scss'],
})
export class InventoryItemListDisplayComponent implements OnInit {
  @Input() public whatToShow: PlayerInventoryItemList;
  public inventoryColumns: string[] = ['quantity', 'description'];

  /** Initialization hook. */
  public ngOnInit(): void {
    if (this.whatToShow.items.length > 0 && isPlayerInventoryItem(this.whatToShow.items[0])) {
      this.inventoryColumns.push('dateAquired');
    }
  }
}
