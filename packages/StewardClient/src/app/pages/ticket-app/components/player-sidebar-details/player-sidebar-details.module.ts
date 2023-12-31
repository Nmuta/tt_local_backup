import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PlayerDetailsItemModule } from '../player-details-item/player-details-item.module';
import { ApolloPlayerSidebarDetailsComponent } from './apollo/apollo-player-sidebar-details.component';
import { OpusPlayerSidebarDetailsComponent } from './opus/opus-player-sidebar-details.component';
import { SunrisePlayerSidebarDetailsComponent } from './sunrise/sunrise-player-sidebar-details.component';
import { SteelheadPlayerSidebarDetailsComponent } from './steelhead/steelhead-player-sidebar-details.component';
import { WoodstockPlayerSidebarDetailsComponent } from './woodstock/woodstock-player-sidebar-details.component';

/** A domain module for displaying player details (designed for ticket-app). */
@NgModule({
  exports: [
    WoodstockPlayerSidebarDetailsComponent,
    SteelheadPlayerSidebarDetailsComponent,
    SunrisePlayerSidebarDetailsComponent,
    ApolloPlayerSidebarDetailsComponent,
    OpusPlayerSidebarDetailsComponent,
    SteelheadPlayerSidebarDetailsComponent,
  ],
  declarations: [
    WoodstockPlayerSidebarDetailsComponent,
    SteelheadPlayerSidebarDetailsComponent,
    SunrisePlayerSidebarDetailsComponent,
    ApolloPlayerSidebarDetailsComponent,
    OpusPlayerSidebarDetailsComponent,
    SteelheadPlayerSidebarDetailsComponent,
  ],
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
    PipesModule,
  ],
})
export class PlayerSidebarDetailsModule {}
