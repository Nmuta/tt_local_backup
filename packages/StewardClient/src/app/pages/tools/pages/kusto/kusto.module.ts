import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { KustoComponent } from './kusto.component';
import { KustoRoutingModule } from './kusto.routing';
import { KustoQuerySelectionModule } from './component/kusto-query-selection/kusto-query-selection.module';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { JsonTableResultsModule } from '@components/json-table-results/json-table-results.module';
import { HelpModule } from '@shared/modules/help/help.module';

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
    JsonTableResultsModule,
    HelpModule,
  ],
  exports: [KustoComponent],
})
export class KustoModule {}
