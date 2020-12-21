import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBanningComponent } from './user-banning.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserBanningRoutingModule } from './user-banning.routing';
import { ApolloBanningComponent } from './apollo/apollo-banning.component';
import { GravityBanningComponent } from './gravity/gravity-banning.component';
import { OpusBanningComponent } from './opus/opus-banning.component';
import { SunriseBanningComponent } from './sunrise/sunrise-banning.component';
import { MatButtonModule } from '@angular/material/button';

/** Routed module for banning users. */
@NgModule({
  declarations: [UserBanningComponent, ApolloBanningComponent, GravityBanningComponent, OpusBanningComponent, SunriseBanningComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    UserBanningRoutingModule,
  ]
})
export class UserBanningModule { }
