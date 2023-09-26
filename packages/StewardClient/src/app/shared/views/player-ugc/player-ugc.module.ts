import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { SunrisePlayerUgcComponent } from './sunrise/sunrise-player-ugc.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { LuxonModule } from 'luxon-angular';
import { UgcFiltersModule } from '../ugc-filters/ugc-filters.module';
import { MatDividerModule } from '@angular/material/divider';
import { WoodstockPlayerUgcComponent } from './woodstock/woodstock-player-ugc.component';
import { FeatureUgcModalModule } from '@views/feature-ugc-modal/feature-ugc-modal.module';
import { ApolloPlayerUgcComponent } from './apollo/apollo-player-ugc.component';
import { UgcTableModule } from '../ugc-table/ugc-table.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { SteelheadPlayerUgcComponent } from './steelhead/steelhead-player-ugc.component';
import { WoodstockPlayerHiddenUgcComponent } from './woodstock/hidden/woodstock-player-hidden-ugc.component';
import { SteelheadPlayerHiddenUgcComponent } from './steelhead/hidden/steelhead-player-hidden-ugc.component';

/** Display for player ugc. */
@NgModule({
  declarations: [
    SunrisePlayerUgcComponent,
    WoodstockPlayerUgcComponent,
    WoodstockPlayerHiddenUgcComponent,
    ApolloPlayerUgcComponent,
    SteelheadPlayerUgcComponent,
    SteelheadPlayerHiddenUgcComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    FontAwesomeModule,
    PipesModule,
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
    StateManagersModule,
    MonitorActionModule,
  ],
  exports: [
    SunrisePlayerUgcComponent,
    WoodstockPlayerUgcComponent,
    WoodstockPlayerHiddenUgcComponent,
    ApolloPlayerUgcComponent,
    SteelheadPlayerUgcComponent,
    SteelheadPlayerHiddenUgcComponent,
  ],
})
export class PlayerUgcModule {}
