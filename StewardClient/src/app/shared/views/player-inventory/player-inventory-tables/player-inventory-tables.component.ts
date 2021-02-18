import { Component, Input } from '@angular/core';
import {
  AcceptablePlayerInventoryTypeUnion,
  PropertyToExpandoData,
} from '../player-inventory.base.component';

/** Helper component for display player inventory tables. */
@Component({
  selector: 'player-inventory-tables',
  templateUrl: './player-inventory-tables.component.html',
  styleUrls: ['./player-inventory-tables.component.scss'],
})
export class PlayerInventoryTablesComponent {
  @Input() public inventory: AcceptablePlayerInventoryTypeUnion;
  @Input() public whatToShow: PropertyToExpandoData<AcceptablePlayerInventoryTypeUnion>;
}
