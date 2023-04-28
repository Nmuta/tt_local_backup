import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { MatChipsModule } from '@angular/material/chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { PlayerInventoryProfilePickerComponent } from './player-inventory-profile-picker.component';
import { SteelheadPlayerInventoryProfilePickerCompositionComponent } from './steelhead/steelhead-player-inventory-profile-picker.component';

/** Module for getting player's inventory profiles. */
@NgModule({
  declarations: [
    PlayerInventoryProfilePickerComponent,
    SteelheadPlayerInventoryProfilePickerCompositionComponent,
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
  exports: [SteelheadPlayerInventoryProfilePickerCompositionComponent],
})
export class PlayerInventoryProfilesCompositionModule {}
