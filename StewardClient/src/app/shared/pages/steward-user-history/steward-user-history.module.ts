import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { StewardUserHistoryComponent } from './steward-user-history.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { StewardUserHistoryRouterModule } from './steward-user-history.routing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { JsonTableResultsModule } from '@components/json-table-results/json-table-results.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

/** Routed module for viewing steward user history. */
@NgModule({
  declarations: [StewardUserHistoryComponent],
  imports: [
    StewardUserHistoryRouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FontAwesomeModule,
    PipesModule,
    JsonDumpModule,
    DirectivesModule,
    MatIconModule,
    TextFieldModule,
    JsonTableResultsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class StewardUserHistoryModule {}
