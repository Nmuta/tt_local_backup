import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBanningComponent } from './user-banning.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserBanningRoutingModule } from './user-banning.routing';
import { ApolloBanningComponent } from './pages/apollo/apollo-banning.component';
import { SunriseBanningComponent } from './pages/sunrise/sunrise-banning.component';
import { MatButtonModule } from '@angular/material/button';
import { BanOptionsComponent } from './components/ban-options/ban-options.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DurationPickerComponent } from './components/duration-picker/duration-picker.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BanChipIconModule } from './components/ban-chip-icon/ban-chip-icon.module';
import { BanHistoryModule } from '@shared/views/ban-history/ban-history.module';
import { PlayerSelectionModule } from '@shared/views/player-selection/player-selection.module';
import { BanResultsModule } from './components/ban-results/ban-results.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SteelheadBanningComponent } from './pages/steelhead/steelhead-banning.component';
import { WoodstockBanningComponent } from './pages/woodstock/woodstock-banning.component';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';

/** Routed module for banning users. */
@NgModule({
  declarations: [
    UserBanningComponent,
    ApolloBanningComponent,
    SunriseBanningComponent,
    SteelheadBanningComponent,
    WoodstockBanningComponent,
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
    BanChipIconModule,
    BanHistoryModule,
    BanResultsModule,
    PipesModule,
    JsonDumpModule,
    DirectivesModule,
    MatTabsModule,
    EndpointSelectionModule,
    MatAutocompleteModule,
    VerifyCheckboxModule,
    StateManagersModule,
  ],
})
export class UserBanningModule {}
