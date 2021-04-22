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
import { SteelheadPlayerInventoryProfilePickerComponent } from './steelhead/steelhead-player-inventory-profile-picker.component';
import { MatIconModule } from '@angular/material/icon';

/**
 * Player Inventory Profile -related components.
 */
@NgModule({
  declarations: [
    SteelheadPlayerInventoryProfilePickerComponent,
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
    MatIconModule,
    FontAwesomeModule,
  ],
  exports: [
    SteelheadPlayerInventoryProfilePickerComponent,
    SunrisePlayerInventoryProfilePickerComponent,
    OpusPlayerInventoryProfilePickerComponent,
    ApolloPlayerInventoryProfilePickerComponent,
    GravityPlayerInventoryProfilePickerComponent,
  ],
})
export class PlayerInventoryProfilesModule {}
