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
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { SafetyRatingComponent } from './safety-rating.component';
import { SteelheadSafetyRatingComponent } from './steelhead/steelhead-safety-rating.component';
import { HelpModule } from '@shared/modules/help/help.module';

/** Module for getting and setting a player's driver level. */
@NgModule({
  declarations: [SafetyRatingComponent, SteelheadSafetyRatingComponent],
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
    MatInputModule,
    MatCheckboxModule,
    VerifyButtonModule,
    ErrorSpinnerModule,
    HelpModule,
  ],
  exports: [SteelheadSafetyRatingComponent],
})
export class SafetyRatingModule {}
