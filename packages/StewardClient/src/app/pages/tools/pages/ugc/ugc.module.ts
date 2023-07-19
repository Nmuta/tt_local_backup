import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UgcComponent } from './ugc.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UgcRoutingModule } from './ugc.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BanHistoryModule } from '@shared/views/ban-history/ban-history.module';
import { PlayerSelectionModule } from '@shared/views/player-selection/player-selection.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatTabsModule } from '@angular/material/tabs';
import { PlayerUgcModule } from '@views/player-ugc/player-ugc.module';
import { MatIconModule } from '@angular/material/icon';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { PastableSingleInputModule } from '@views/pastable-single-input/pastable-single-input.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
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
