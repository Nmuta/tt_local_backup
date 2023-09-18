import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { HomeComponent } from './home.component';
import { HomeRouterModule } from './home.routing.module';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { AvailableAppsModule } from '@shared/views/available-apps/available-apps.module';

/** Defines the auth module. */
@NgModule({
  imports: [
    CommonModule,
    HomeRouterModule,
    MatCardModule,
    MatButtonModule,
    CenterContentsModule,
    PipesModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FontAwesomeModule,
    AvailableAppsModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
