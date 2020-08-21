import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftingPageComponent } from './gifting-page.cmpt';
export { GiftingPageComponent } from './gifting-page.cmpt';

import { InventoryModule } from '../inventory/inventory.module';
import { InventoryOptionsModule } from '../inventory-options/inventory-options.module';

@NgModule({
    imports: [
        CommonModule,
        InventoryModule,
        InventoryOptionsModule
    ],
    exports: [GiftingPageComponent],
    declarations: [GiftingPageComponent],
})
export class GiftingPageModule {}
