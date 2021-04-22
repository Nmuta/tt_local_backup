import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { JsonTableResultsComponent } from './json-table-results.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';

/** The feature module for the kusto query selection component. */
@NgModule({
  declarations: [JsonTableResultsComponent],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    PipesModule,
    JsonDumpModule,
    DirectivesModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    MatIconModule,
    FontAwesomeModule,
  ],
  exports: [JsonTableResultsComponent],
})
export class JsonTableResultsModule {}
