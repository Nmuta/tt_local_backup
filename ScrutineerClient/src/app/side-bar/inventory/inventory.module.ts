import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { InventoryComponent } from "./inventory.component";
export { InventoryComponent } from "./inventory.component";

/** Defines the inventory module. */
@NgModule({
  imports: [CommonModule],
  exports: [InventoryComponent],
  declarations: [InventoryComponent],
})
export class InventoryModule {}
