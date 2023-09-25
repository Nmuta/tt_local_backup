import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { PlayerInventoryProfilePickerComponent } from './player-inventory-profile-picker.component';
import { OpusPlayerInventoryProfilePickerComponent } from './opus/opus-player-inventory-profile-picker.component';
import { ApolloPlayerInventoryProfilePickerComponent } from './apollo/apollo-player-inventory-profile-picker.component';
import { SunrisePlayerInventoryProfilePickerComponent } from './sunrise/sunrise-player-inventory-profile-picker.component';
import { WoodstockPlayerInventoryProfilePickerComponent } from './woodstock/woodstock-player-inventory-profile-picker.component';
import { SteelheadPlayerInventoryProfilePickerComponent } from './steelhead/steelhead-player-inventory-profile-picker.component';

/** Module for getting player's inventory profiles. */
@NgModule({
  declarations: [
    PlayerInventoryProfilePickerComponent,
    OpusPlayerInventoryProfilePickerComponent,
    ApolloPlayerInventoryProfilePickerComponent,
    SunrisePlayerInventoryProfilePickerComponent,
    WoodstockPlayerInventoryProfilePickerComponent,
    SteelheadPlayerInventoryProfilePickerComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    PipesModule,
    JsonDumpModule,
    MatIconModule,
    MatButtonModule,
    DirectivesModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    MonitorActionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    StateManagersModule,
    PermissionsModule,
    MatChipsModule,
    FontAwesomeModule,
    ErrorSpinnerModule,
  ],
  exports: [
    OpusPlayerInventoryProfilePickerComponent,
    ApolloPlayerInventoryProfilePickerComponent,
    SunrisePlayerInventoryProfilePickerComponent,
    WoodstockPlayerInventoryProfilePickerComponent,
    SteelheadPlayerInventoryProfilePickerComponent,
  ],
})
export class PlayerInventoryProfilesModule {}
