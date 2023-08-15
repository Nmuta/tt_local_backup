import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './home.component';
import { HomeRouterModule } from './home.routing.module';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvailableAppsModule } from '@shared/views/available-apps/available-apps.module';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';

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
    TourMatMenuModule,    // loaded to ensure tours run properly
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
