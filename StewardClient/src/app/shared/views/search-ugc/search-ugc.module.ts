import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { VerifyActionButtonModule } from '@components/verify-action-button/verify-action-button.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { LuxonModule } from 'luxon-angular';
import { UgcFiltersModule } from '../ugc-filters/ugc-filters.module';
import { MatDividerModule } from '@angular/material/divider';
import { FeatureUgcModalModule } from '@views/feature-ugc-modal/feature-ugc-modal.module';
import { UgcTableModule } from '../ugc-table/ugc-table.module';
import { UgcSearchFiltersModule } from '@views/ugc-search-filters/ugc-search-filters.module';
import { WoodstockSearchUgcComponent } from './woodstock/woodstock-search-ugc.component';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';

/** Display for public ugc. */
@NgModule({
  declarations: [WoodstockSearchUgcComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    FontAwesomeModule,
    PipesModule,
    VerifyActionButtonModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    DirectivesModule,
    PipesModule,
    LuxonModule,
    UgcFiltersModule,
    FeatureUgcModalModule,
    MatDividerModule,
    UgcTableModule,
    UgcSearchFiltersModule,
    MonitorActionModule,
  ],
  exports: [WoodstockSearchUgcComponent],
})
export class SearchUgcModule {}
