import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunrisePlayerInventoryComponent } from './sunrise/sunrise-player-inventory.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OpusPlayerInventoryComponent } from './opus/opus-player-inventory.component';
import { ApolloPlayerInventoryComponent } from './apollo/apollo-player-inventory.component';
import { GravityPlayerInventoryComponent } from './gravity/gravity-player-inventory.component';
import { InventoryItemListDisplayModule } from '@views/inventory-item-list-display/inventory-item-list-display.module';
import { SteelheadPlayerInventoryComponent } from './steelhead/steelhead-player-inventory.component';
import { WoodstockPlayerInventoryComponent } from './woodstock/woodstock-player-inventory.component';

/** Feature module containing cards that display player inventory. */
@NgModule({
  declarations: [
    WoodstockPlayerInventoryComponent,
    SteelheadPlayerInventoryComponent,
    SunrisePlayerInventoryComponent,
    OpusPlayerInventoryComponent,
    ApolloPlayerInventoryComponent,
    GravityPlayerInventoryComponent,
  ],
  imports: [
    CommonModule,
    PipesModule,
    JsonDumpModule,
    MatTableModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    InventoryItemListDisplayModule,
  ],
  exports: [
    WoodstockPlayerInventoryComponent,
    SteelheadPlayerInventoryComponent,
    SunrisePlayerInventoryComponent,
    OpusPlayerInventoryComponent,
    ApolloPlayerInventoryComponent,
    GravityPlayerInventoryComponent,
  ],
})
export class PlayerInventoryModule {}
