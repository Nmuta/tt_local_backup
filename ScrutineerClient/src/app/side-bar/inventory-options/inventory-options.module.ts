import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryOptionsCmpt } from './inventory-options.cmpt';
export { InventoryOptionsCmpt } from './inventory-options.cmpt';
@NgModule({
    imports: [CommonModule],
    exports: [InventoryOptionsCmpt],
    declarations: [InventoryOptionsCmpt],
})
export class InventoryOptionsModule {}