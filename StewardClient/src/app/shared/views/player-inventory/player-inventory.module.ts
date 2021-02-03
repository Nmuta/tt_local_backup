import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerInventoryComponent } from './player-inventory.component';
import { SunrisePlayerInventoryComponent } from './sunrise/sunrise.component';
import { PipesModule } from '@shared/pipes/pipes.module';

/** Feature module containing cards that display player inventory. */
@NgModule({
  declarations: [
    PlayerInventoryComponent,
    SunrisePlayerInventoryComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
  ],
  exports: [
    SunrisePlayerInventoryComponent,
  ]
})
export class PlayerInventoryModule { }
