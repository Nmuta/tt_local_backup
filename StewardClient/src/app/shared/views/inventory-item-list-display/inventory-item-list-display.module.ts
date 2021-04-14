import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { InventoryItemListDisplayComponent } from './inventory-item-list-display.component';
import { MatExpansionModule } from '@angular/material/expansion';

/** A domain module for displaying related gamertags. */
@NgModule({
  declarations: [InventoryItemListDisplayComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatExpansionModule,
    FontAwesomeModule,
    PipesModule,
    JsonDumpModule,
  ],
  exports: [InventoryItemListDisplayComponent],
})
export class InventoryItemListDisplayModule {}
