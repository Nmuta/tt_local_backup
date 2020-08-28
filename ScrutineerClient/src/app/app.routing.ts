import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorComponent } from './error/error.component';
import { ZendeskGuardService } from './route-guards/app.zendesk.guard.service';

const routes: Routes = [
  {
    path: 'sidebar',
    canActivate: [ZendeskGuardService],
    loadChildren: () =>
      import('./side-bar/side-bar.module').then(m => m.SidebarModule),
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
  { path: '**', redirectTo: 'error' },
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
