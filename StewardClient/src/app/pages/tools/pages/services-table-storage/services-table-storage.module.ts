import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerSelectionModule } from '@shared/views/player-selection/player-selection.module';
import { ServicesTableStorageRouterModule } from './services-table-storage.routing';
import { MatTabsModule } from '@angular/material/tabs';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { GamertagsModule } from '@shared/views/gamertags/gamertags.module';
import { OverviewModule } from '@shared/views/overview/overview.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlayerIdentityResultsModule } from '@shared/views/player-identity-results/player-identity-results.module';
import { MatCardModule } from '@angular/material/card';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PlayerProfileManagementModule } from '@views/player-profile-management/player-profile-management.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { ServicesTableStorageComponent } from './services-table-storage.component';
import { SteelheadServicesTableStorageComponent } from './steelhead/steelhead-services-table-storage.component';
import { ServicesFilterableTableComponent } from './components/services-filterable-table/services-filterable-table.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { JsonTableResultsModule } from '@components/json-table-results/json-table-results.module';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatTableModule } from '@angular/material/table';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { ServicesTableResultsComponent } from './components/services-table-results/services-table-results.component';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { WoodstockServicesTableStorageComponent } from './woodstock/woodstock-services-table-storage.component';
import { PlayerInventoryProfilesModule } from '@views/player-inventory-profiles/player-inventory-profile-picker.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
/** The feature module for the Services Table Storage route. */
@NgModule({
  declarations: [
    ServicesTableStorageComponent,
    SteelheadServicesTableStorageComponent,
    WoodstockServicesTableStorageComponent,
    ServicesFilterableTableComponent,
    ServicesTableResultsComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    ServicesTableStorageRouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    FontAwesomeModule,
    FormsModule,
    PlayerSelectionModule,
    CommonModule,
    MatTabsModule,
    PipesModule,
    GamertagsModule,
    OverviewModule,
    JsonDumpModule,
    PlayerInventoryProfilesModule,
    PlayerSelectionModule,
    MatTooltipModule,
    PlayerIdentityResultsModule,
    EndpointSelectionModule,
    MonitorActionModule,
    PlayerProfileManagementModule,
    StateManagersModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSelectModule,
    JsonTableResultsModule,
    CommonModule,
    RouterModule,
    DirectivesModule,
    MatTableModule,
    StandardDateModule,
    StandardCopyModule,
    MatSlideToggleModule,
  ],
})
export class ServicesTableStorageModule {}
