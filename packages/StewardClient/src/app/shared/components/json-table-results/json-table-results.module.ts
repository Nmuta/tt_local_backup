import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { JsonTableResultsComponent } from './json-table-results.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { RouterModule } from '@angular/router';

/** The feature module for the kusto query selection component. */
@NgModule({
  declarations: [JsonTableResultsComponent],
  imports: [
    CommonModule,
    RouterModule,
    ErrorSpinnerModule,
    PipesModule,
    JsonDumpModule,
    DirectivesModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    MatIconModule,
    FontAwesomeModule,
    StandardDateModule,
  ],
  exports: [JsonTableResultsComponent],
})
export class JsonTableResultsModule {}
