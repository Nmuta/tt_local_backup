import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InventoryCmpt } from "./inventory.cmpt";
export { InventoryCmpt } from "./inventory.cmpt";
@NgModule({
    imports: [CommonModule],
    exports: [InventoryCmpt],
    declarations: [InventoryCmpt],
})
export class InventoryModule {}