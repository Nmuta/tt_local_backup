import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalRedirectRouterModule } from './external-redirect.routing';
import { ExternalRedirectComponent } from './external-redirect.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatIconModule } from '@angular/material/icon';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';

/** Module for external redirects. */
@NgModule({
  declarations: [ExternalRedirectComponent],
  imports: [
    ExternalRedirectRouterModule,
    CommonModule,
    MatProgressSpinnerModule,
    MonitorActionModule,
    MatIconModule,
    TourMatMenuModule,    // loaded to ensure tours run properly
  ],
  exports: [ExternalRedirectComponent],
})
export class ExternalRedirectModule {}
