import { Component, Input } from '@angular/core';
import { MasterInventoryItemList } from '@models/master-inventory-item-list';

/** Helper component for display lists of master inventory items. */
@Component({
  selector: 'inventory-item-list-display',
  templateUrl: './inventory-item-list-display.component.html',
  styleUrls: ['./inventory-item-list-display.component.scss'],
})
export class InventoryItemListDisplayComponent {
  @Input() public whatToShow: MasterInventoryItemList;
}
