import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SunriseProfileNotesComponent } from './sunrise/sunrise-profile-notes.component';
import { MatTableModule } from '@angular/material/table';
import { WoodstockProfileNotesComponent } from './woodstock/woodstock-profile-notes.component';
import { ProfileNotesComponent } from './profile-notes.component';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { SteelheadProfileNotesComponent } from './steelhead/steelhead-profile-notes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
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
