import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryOptionsComponent } from './inventory-options.cmpt';
export { InventoryOptionsComponent } from './inventory-options.cmpt';

@NgModule({
    imports: [CommonModule],
    exports: [InventoryOptionsComponent],
    declarations: [InventoryOptionsComponent],
})
export class InventoryOptionsModule {}
