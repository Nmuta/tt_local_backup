import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalRedirectRouterModule } from './external-redirect.routing';
import { ExternalRedirectComponent } from './external-redirect.component';

/** Module for external redirects. */
@NgModule({
  declarations: [ExternalRedirectComponent],
  imports: [ExternalRedirectRouterModule, CommonModule],
  exports: [ExternalRedirectComponent],
})
export class ExternalRedirectModule {}
