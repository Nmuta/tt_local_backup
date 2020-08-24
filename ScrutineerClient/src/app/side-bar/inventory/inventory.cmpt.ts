import { Component, Input } from '@angular/core';
import { InventoryOptions } from '@shared/models/enums';

/** Inventory component */
@Component({
    selector: 'inventory',
    templateUrl: './inventory.html',
    styleUrls: ['./inventory.scss']
})
export class InventoryComponent {
    @Input() selectedGiftingOption: InventoryOptions;

    constructor() {
        // Empty
    }
}
