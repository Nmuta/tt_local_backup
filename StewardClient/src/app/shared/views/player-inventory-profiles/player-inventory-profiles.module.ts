import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunrisePlayerInventoryProfilePickerComponent } from './sunrise/sunrise-player-inventory-profile-picker.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApolloPlayerInventoryProfilePickerComponent } from './apollo/apollo-player-inventory-profile-picker.component';
import { OpusPlayerInventoryProfilePickerComponent } from './opus/opus-player-inventory-profile-picker.component';
import { GravityPlayerInventoryProfilePickerComponent } from './gravity/gravity-player-inventory-profile-picker.component';

/**
 * Player Inventory Profile -related components.
 */
@NgModule({
  declarations: [
    SunrisePlayerInventoryProfilePickerComponent,
    OpusPlayerInventoryProfilePickerComponent,
    ApolloPlayerInventoryProfilePickerComponent,
    GravityPlayerInventoryProfilePickerComponent,
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatChipsModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
  ],
  exports: [
    SunrisePlayerInventoryProfilePickerComponent,
    OpusPlayerInventoryProfilePickerComponent,
    ApolloPlayerInventoryProfilePickerComponent,
    GravityPlayerInventoryProfilePickerComponent,
  ]
})
export class PlayerInventoryProfilesModule { }
