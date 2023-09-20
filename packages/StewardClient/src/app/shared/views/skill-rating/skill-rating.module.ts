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
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { SkillRatingComponent } from './skill-rating.component';
import { SteelheadSkillRatingComponent } from './steelhead/steelhead-skill-rating.component';
import { HelpModule } from '@shared/modules/help/help.module';

/** Module for getting and setting a player's skill rating override. */
@NgModule({
  declarations: [SkillRatingComponent, SteelheadSkillRatingComponent],
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
  exports: [SteelheadSkillRatingComponent],
})
export class SkillRatingModule {}
