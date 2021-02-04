import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunrisePlayerInventoryComponent } from './sunrise/sunrise.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';

/** Feature module containing cards that display player inventory. */
@NgModule({
  declarations: [
    SunrisePlayerInventoryComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    JsonDumpModule,
    MatTableModule,
    MatTooltipModule,
    MatExpansionModule,
  ],
  exports: [
    SunrisePlayerInventoryComponent,
  ]
})
export class PlayerInventoryModule { }
