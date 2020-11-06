import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorComponent } from './error/error.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { ZendeskGuardService } from './route-guards/app.zendesk.guard.service';

const routes: Routes = [
  {
    path: 'navbar-app',
    // canActivate: [ZendeskGuardService],
    loadChildren: () =>
      import('./navbar-app/navbar-app.module').then(m => m.NavbarAppModule),
  },
  {
    path: 'ticket-sidebar',
    canActivate: [ZendeskGuardService],
    loadChildren: () =>
      import('./ticket-sidebar/ticket-sidebar.module').then(
        m => m.TicketSidebarModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: '**',
    component: FourOhFourComponent,
  },
];

/** Defines the app router. */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      onSameUrlNavigation: 'reload',
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
