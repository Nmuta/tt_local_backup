import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseCreditHistoryComponent } from './sunrise/sunrise-credit-history.component';
import { WoodstockCreditHistoryComponent } from './woodstock/woodstock-credit-history.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTableModule } from '@angular/material/table';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatButtonModule } from '@angular/material/button';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HelpModule } from '@shared/modules/help/help.module';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { CreditUpdateSortOptionsComponent } from './components/credit-update-sort-options/credit-update-sort-options.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

/** A domain module for displaying credit histories. */
@NgModule({
  declarations: [WoodstockCreditHistoryComponent, SunriseCreditHistoryComponent, CreditUpdateSortOptionsComponent],
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
    
    MatDialogModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MakeModelAutocompleteModule,
    MatCheckboxModule,

    MatButtonToggleModule,
  ],
  exports: [WoodstockCreditHistoryComponent, SunriseCreditHistoryComponent],
})
export class CreditHistoryModule {}
