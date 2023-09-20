import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunrisePlayerNotificationsComponent } from './sunrise/sunrise-player-notifications.component';
import { WoodstockPlayerNotificationsComponent } from './woodstock/woodstock-player-notifications.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';
import { SteelheadPlayerNotificationsComponent } from './steelhead/steelhead-player-notifications.component';

/** A domain module for displaying player notifications. */
@NgModule({
  declarations: [
    SunrisePlayerNotificationsComponent,
    WoodstockPlayerNotificationsComponent,
    SteelheadPlayerNotificationsComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    JsonDumpModule,
    MatCardModule,
    ErrorSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    PipesModule,
    MatTooltipModule,
    MatIconModule,
  ],
  exports: [
    SunrisePlayerNotificationsComponent,
    WoodstockPlayerNotificationsComponent,
    SteelheadPlayerNotificationsComponent,
  ],
})
export class PlayerNotificationsModule {}
