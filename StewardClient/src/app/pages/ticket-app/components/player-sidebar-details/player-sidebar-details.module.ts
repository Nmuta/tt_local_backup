import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentCollapseModule } from '@components/content-collapse/content-collapse.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PlayerDetailsItemModule } from './player-details-item/player-details-item.module';
import { ApolloPlayerSidebarDetailsComponent } from './titles/apollo/apollo-player-sidebar-details.component';
import { GravityPlayerSidebarDetailsComponent } from './titles/gravity/gravity-player-sidebar-details.component';
import { OpusPlayerSidebarDetailsComponent } from './titles/opus/opus-player-sidebar-details.component';
import { SunrisePlayerSidebarDetailsComponent } from './titles/sunrise/sunrise-player-sidebar-details.component';

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
    ContentCollapseModule,
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
