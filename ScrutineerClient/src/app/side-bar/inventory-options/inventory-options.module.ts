import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InventoryOptionsComponent } from './inventory-options.component';
export { InventoryOptionsComponent } from './inventory-options.component';

/** Defines the inventory options module. */
@NgModule({
  imports: [CommonModule],
  exports: [InventoryOptionsComponent],
  declarations: [InventoryOptionsComponent],
})
export class InventoryOptionsModule {}
