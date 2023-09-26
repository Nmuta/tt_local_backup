import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UgcComponent } from './ugc.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UgcRoutingModule } from './ugc.routing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BanHistoryModule } from '@shared/views/ban-history/ban-history.module';
import { PlayerSelectionModule } from '@shared/views/player-selection/player-selection.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { PlayerUgcModule } from '@views/player-ugc/player-ugc.module';
import { MatIconModule } from '@angular/material/icon';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { PastableSingleInputModule } from '@views/pastable-single-input/pastable-single-input.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterModule } from '@angular/router';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { HelpModule } from '@shared/modules/help/help.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { FeatureUgcModalModule } from '@views/feature-ugc-modal/feature-ugc-modal.module';
import { UgcFiltersModule } from '@views/ugc-filters/ugc-filters.module';
import { UgcSearchFiltersModule } from '@views/ugc-search-filters/ugc-search-filters.module';
import { UgcTableModule } from '@views/ugc-table/ugc-table.module';
import { LuxonModule } from 'luxon-angular';
import { WoodstockSearchUgcComponent } from './pages/woodstock/woodstock-search-ugc.component';
import { SteelheadSearchUgcComponent } from './pages/steelhead/steelhead-search-ugc.component';

/** Routed module for ugc users. */
@NgModule({
  declarations: [UgcComponent, WoodstockSearchUgcComponent, SteelheadSearchUgcComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    UgcRoutingModule,
    PlayerSelectionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    MatChipsModule,
    BanHistoryModule,
    PipesModule,
    JsonDumpModule,
    DirectivesModule,
    MatTabsModule,
    PlayerUgcModule,
    MatIconModule,
    PastableSingleInputModule,
    EndpointSelectionModule,
    MatTooltipModule,
    ErrorSpinnerModule,
    MatPaginatorModule,
    LuxonModule,
    UgcFiltersModule,
    FeatureUgcModalModule,
    MatDividerModule,
    UgcTableModule,
    UgcSearchFiltersModule,
    MonitorActionModule,
    RouterModule,
    HelpModule,
    StateManagersModule,
  ],
})
export class UgcModule {}
