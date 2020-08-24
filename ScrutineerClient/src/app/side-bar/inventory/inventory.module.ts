import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InventoryComponent } from './inventory.cmpt';
export { InventoryComponent } from './inventory.cmpt';

/** Defines the inventory module. */
@NgModule({
    imports: [CommonModule],
    exports: [InventoryComponent],
    declarations: [InventoryComponent],
})
export class InventoryModule {}
