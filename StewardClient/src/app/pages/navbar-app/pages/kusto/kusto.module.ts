import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { KustoComponent } from './kusto.component';
import { KustoRoutingModule } from './kusto.routing';
import { KustoQuerySelectionModule } from './component/kusto-query-selection/kusto-query-selection.module';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KustoQueryResultsModule } from './component/kusto-query-results/kusto-query-results.module';
import { MatTooltipModule } from '@angular/material/tooltip';

/** Module for displaying the available apps, or a login button. */
@NgModule({
  declarations: [KustoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    KustoRoutingModule,
    MatInputModule,
    MatTooltipModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    KustoQuerySelectionModule,
    KustoQueryResultsModule,
  ],
  exports: [KustoComponent],
})
export class KustoModule {}
