import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SunriseProfileNotesComponent } from './sunrise/sunrise-profile-notes.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { WoodstockProfileNotesComponent } from './woodstock/woodstock-profile-notes.component';
import { ProfileNotesComponent } from './profile-notes.component';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { SteelheadProfileNotesComponent } from './steelhead/steelhead-profile-notes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';

/** A domain module for displaying user profile notes. */
@NgModule({
  declarations: [
    ProfileNotesComponent,
    SunriseProfileNotesComponent,
    WoodstockProfileNotesComponent,
    SteelheadProfileNotesComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    PipesModule,
    MatTooltipModule,
    JsonDumpModule,
    FontAwesomeModule,
    PermissionsModule,
    DirectivesModule,
    MonitorActionModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    VerifyButtonModule,
    MatButtonModule,
    MatInputModule,
    StateManagersModule,
  ],
  exports: [
    SunriseProfileNotesComponent,
    WoodstockProfileNotesComponent,
    SteelheadProfileNotesComponent,
  ],
})
export class ProfileNotesModule {}
