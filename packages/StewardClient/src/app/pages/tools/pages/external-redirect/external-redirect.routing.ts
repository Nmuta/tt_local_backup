import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalRedirectComponent, ExternalRedirectOption } from './external-redirect.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: ExternalRedirectOption.Email,
  },
  {
    path: ':externalTool',
    component: ExternalRedirectComponent,
  },
];

/** Routing module for external redirects. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalRedirectRouterModule {}
