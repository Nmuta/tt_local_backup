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
import { SunrisePlayerUGCComponent } from './sunrise/sunrise-player-ugc.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { LuxonModule } from 'luxon-angular';
import { UGCFiltersModule } from './components/ugc-filters/ugc-filters.module';
import { MatDividerModule } from '@angular/material/divider';
import { WoodstockPlayerUgcComponent } from './woodstock/woodstock-player-ugc.component';
import { FeatureUGCModalModule } from '@views/feature-ugc-modal/feature-ugc-modal.module';
import { UGCTableModule } from './components/ugc-table/ugc-table.module';

/** Display for player ugc. */
@NgModule({
  declarations: [SunrisePlayerUGCComponent, WoodstockPlayerUgcComponent],
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
    UGCFiltersModule,
    FeatureUGCModalModule,
    MatDividerModule,
    UGCTableModule,
  ],
  exports: [SunrisePlayerUGCComponent, WoodstockPlayerUgcComponent],
})
export class PlayerUGCModule {}
