import { Component, Input } from '@angular/core';
import { InventoryOptions } from '@shared/models/enums';

@Component({
    selector: 'inventory',
    templateUrl: './inventory.html',
    styleUrls: ['./inventory.scss']
})
export class InventoryCmpt {
    @Input() selectedGiftingOption: InventoryOptions;
    
    constructor() {}
}