import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PlayerDetailsItemModule } from '../player-details-item/player-details-item.module';
import { ApolloPlayerSidebarDetailsComponent } from './apollo/apollo-player-sidebar-details.component';
import { GravityPlayerSidebarDetailsComponent } from './gravity/gravity-player-sidebar-details.component';
import { OpusPlayerSidebarDetailsComponent } from './opus/opus-player-sidebar-details.component';
import { SunrisePlayerSidebarDetailsComponent } from './sunrise/sunrise-player-sidebar-details.component';

/** A domain module for displaying player details (designed for ticket-app). */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    ErrorSpinnerModule,
    PlayerDetailsItemModule,
    JsonDumpModule,
  ],
  exports: [
    GravityPlayerSidebarDetailsComponent,
    SunrisePlayerSidebarDetailsComponent,
    ApolloPlayerSidebarDetailsComponent,
    OpusPlayerSidebarDetailsComponent,
  ],
  declarations: [
    GravityPlayerSidebarDetailsComponent,
    SunrisePlayerSidebarDetailsComponent,
    ApolloPlayerSidebarDetailsComponent,
    OpusPlayerSidebarDetailsComponent,
  ],
})
export class PlayerSidebarDetailsModule {}
