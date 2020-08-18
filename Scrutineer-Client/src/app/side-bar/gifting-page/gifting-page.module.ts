import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GiftingPageCmpt } from "./gifting-page.cmpt";
export { GiftingPageCmpt } from "./gifting-page.cmpt";

import { InventoryModule } from "../inventory/inventory.module";
import { InventoryOptionsModule } from "../inventory-options/inventory-options.module";

@NgModule({
    imports: [
        CommonModule,
        InventoryModule,
        InventoryOptionsModule
    ],
    exports: [GiftingPageCmpt],
    declarations: [GiftingPageCmpt],
})
export class GiftingPageModule {}