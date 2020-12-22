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

/** Routed module for banning users. */
@NgModule({
  declarations: [UserBanningComponent, ApolloBanningComponent, GravityBanningComponent, OpusBanningComponent, SunriseBanningComponent, BanOptionsComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    UserBanningRoutingModule,
    PlayerSelectionModule,
  ]
})
export class UserBanningModule { }
