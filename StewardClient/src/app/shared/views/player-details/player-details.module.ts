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
import { ApolloPlayerDetailsComponent } from './titles/apollo/apollo-player-details.component';
import { GravityPlayerDetailsComponent } from './titles/gravity/gravity-player-details.component';
import { OpusPlayerDetailsComponent } from './titles/opus/opus-player-details.component';
import { SunrisePlayerDetailsComponent } from './titles/sunrise/sunrise-player-details.component';

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
    GravityPlayerDetailsComponent,
    SunrisePlayerDetailsComponent,
    ApolloPlayerDetailsComponent,
    OpusPlayerDetailsComponent,
  ],
  declarations: [
    GravityPlayerDetailsComponent,
    SunrisePlayerDetailsComponent,
    ApolloPlayerDetailsComponent,
    OpusPlayerDetailsComponent,
  ],
})
export class PlayerDetailsModule {}
