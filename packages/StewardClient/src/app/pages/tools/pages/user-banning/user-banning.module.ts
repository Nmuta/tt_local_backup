import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBanningComponent } from './user-banning.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserBanningRoutingModule } from './user-banning.routing';
import { ApolloBanningComponent } from './pages/apollo/apollo-banning.component';
import { SunriseBanningComponent } from './pages/sunrise/sunrise-banning.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { BanOptionsComponent } from './components/ban-options/ban-options.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DurationPickerComponent } from './components/duration-picker/duration-picker.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BanChipIconModule } from './components/ban-chip-icon/ban-chip-icon.module';
import { BanHistoryModule } from '@shared/views/ban-history/ban-history.module';
import { PlayerSelectionModule } from '@shared/views/player-selection/player-selection.module';
import { BanResultsModule } from './components/ban-results/ban-results.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { SteelheadBanningComponent } from './pages/steelhead/steelhead-banning.component';
import { WoodstockBanningComponent } from './pages/woodstock/woodstock-banning.component';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { ForumBanningComponent } from './pages/forum/forum-banning.component';
import { ForumBanHistoryModule } from '@views/forum-ban-history/forum-ban-history.module';
import { MatIconModule } from '@angular/material/icon';

/** Routed module for banning users. */
@NgModule({
  declarations: [
    UserBanningComponent,
    ApolloBanningComponent,
    SunriseBanningComponent,
    SteelheadBanningComponent,
    WoodstockBanningComponent,
    ForumBanningComponent,
    BanOptionsComponent,
    DurationPickerComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    UserBanningRoutingModule,
    PlayerSelectionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    MatChipsModule,
    MatIconModule,
    BanChipIconModule,
    BanHistoryModule,
    BanResultsModule,
    PipesModule,
    JsonDumpModule,
    DirectivesModule,
    MatTabsModule,
    EndpointSelectionModule,
    MatAutocompleteModule,
    VerifyButtonModule,
    StateManagersModule,
    MonitorActionModule,
    PermissionsModule,
    ForumBanHistoryModule,
  ],
})
export class UserBanningModule {}
