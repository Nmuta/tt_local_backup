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

/** A domain module for displaying user profile notes. */
@NgModule({
  declarations: [SunriseProfileNotesComponent, WoodstockProfileNotesComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    PipesModule,
    MatTooltipModule,
    JsonDumpModule,
    FontAwesomeModule,
  ],
  exports: [SunriseProfileNotesComponent, WoodstockProfileNotesComponent],
})
export class ProfileNotesModule {}
