import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { WoodstockPlayerGameDetailsComponent } from './woodstock/woodstock-player-game-details.component';
import { SteelheadPlayerGameDetailsComponent } from './steelhead/steelhead-player-game-details.component';
import { PlayerGameDetailsBaseComponent } from './player-game-details.base.component';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';

/** A domain module for displaying user game details. */
@NgModule({
  declarations: [
    PlayerGameDetailsBaseComponent,
    WoodstockPlayerGameDetailsComponent,
    SteelheadPlayerGameDetailsComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ErrorSpinnerModule,
    MatIconModule,
    JsonDumpModule,
    FontAwesomeModule,
    MatInputModule,
    PipesModule,
    MonitorActionModule,
  ],
  exports: [WoodstockPlayerGameDetailsComponent, SteelheadPlayerGameDetailsComponent],
})
export class PlayerGameDetailsModule {}
