import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBanningComponent } from './user-banning.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserBanningRoutingModule } from './user-banning.routing';
import { ApolloBanningComponent } from './pages/apollo/apollo-banning.component';
import { SunriseBanningComponent } from './pages/sunrise/sunrise-banning.component';
import { MatButtonModule } from '@angular/material/button';
import { OldPlayerSelectionModule } from '../../components/player-selection-old/player-selection.module';
import { BanOptionsComponent } from './components/ban-options/ban-options.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DurationPickerComponent } from './components/duration-picker/duration-picker.component';
import { VerifyActionButtonModule } from '@components/verify-action-button/verify-action-button.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { BanChipsComponent } from './components/ban-chips/ban-chips.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BanChipIconModule } from './components/ban-chip-icon/ban-chip-icon.module';
import { BanHistoryModule } from '@shared/views/ban-history/ban-history.module';
import { PlayerSelectionModule } from '@navbar-app/components/player-selection/player-selection.module';
import { BanResultsModule } from './components/ban-results/ban-results.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { DirectivesModule } from '@shared/directives/directives.module';

/** Routed module for banning users. */
@NgModule({
  declarations: [
    UserBanningComponent,
    ApolloBanningComponent,
    SunriseBanningComponent,
    BanOptionsComponent,
    DurationPickerComponent,
    BanChipsComponent,
  ],
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
    UserBanningRoutingModule,
    OldPlayerSelectionModule,
    PlayerSelectionModule,
    VerifyActionButtonModule,
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
  ],
})
export class UserBanningModule {}
