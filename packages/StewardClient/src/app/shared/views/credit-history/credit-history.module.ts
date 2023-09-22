import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseCreditHistoryComponent } from './sunrise/sunrise-credit-history.component';
import { WoodstockCreditHistoryComponent } from './woodstock/woodstock-credit-history.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HelpModule } from '@shared/modules/help/help.module';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { CreditUpdateSortOptionsComponent } from './components/credit-update-sort-options/credit-update-sort-options.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

/** A domain module for displaying credit histories. */
@NgModule({
  declarations: [
    WoodstockCreditHistoryComponent,
    SunriseCreditHistoryComponent,
    CreditUpdateSortOptionsComponent,
  ],
  imports: [
    ...STANDARD_DATE_IMPORTS,
    StandardDateModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    PipesModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatButtonModule,
    TableVirtualScrollModule,
    ScrollingModule,
    HelpModule,
    MatIconModule,
    MatExpansionModule,
    MatTooltipModule,
    DirectivesModule,
    MonitorActionModule,
    StateManagersModule,
    CommonModule,
    MatFormFieldModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonToggleModule,
  ],
  exports: [WoodstockCreditHistoryComponent, SunriseCreditHistoryComponent],
})
export class CreditHistoryModule {}
