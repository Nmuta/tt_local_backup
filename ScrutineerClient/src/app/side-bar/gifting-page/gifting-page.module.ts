import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InventoryOptionsModule } from '../inventory-options/inventory-options.module';
import { InventoryModule } from '../inventory/inventory.module';

import { GiftingPageComponent } from './gifting-page.cmpt';
export { GiftingPageComponent } from './gifting-page.cmpt';

/** Gifting Page module */
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
