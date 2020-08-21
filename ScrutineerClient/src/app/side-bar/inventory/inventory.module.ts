import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.cmpt';
export { InventoryComponent } from './inventory.cmpt';

@NgModule({
    imports: [CommonModule],
    exports: [InventoryComponent],
    declarations: [InventoryComponent],
})
export class InventoryModule {}
