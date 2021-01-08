import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBanningComponent } from './user-banning.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserBanningRoutingModule } from './user-banning.routing';
import { ApolloBanningComponent } from './pages/apollo/apollo-banning.component';
import { GravityBanningComponent } from './pages/gravity/gravity-banning.component';
import { OpusBanningComponent } from './pages/opus/opus-banning.component';
import { SunriseBanningComponent } from './pages/sunrise/sunrise-banning.component';
import { MatButtonModule } from '@angular/material/button';
import { PlayerSelectionModule } from '../../components/player-selection/player-selection.module';
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

/** Routed module for banning users. */
@NgModule({
  declarations: [
    UserBanningComponent,
    ApolloBanningComponent,
    GravityBanningComponent,
    OpusBanningComponent,
    SunriseBanningComponent,
    BanOptionsComponent,
    DurationPickerComponent,
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
    PlayerSelectionModule,
    VerifyActionButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
  ],
})
export class UserBanningModule {}
