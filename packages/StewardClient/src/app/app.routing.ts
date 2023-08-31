import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { AuthGuard } from './route-guards/auth.guard';
import { ZendeskGuard } from './route-guards/zendesk.guard';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./pages/tools/tools-app.module').then(m => m.ToolsAppModule),
  },
  {
    path: 'ticket-app',
    canActivate: [AuthGuard, ZendeskGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./pages/ticket-app/ticket-app.module').then(m => m.TicketAppModule),
  },
  {
    path: 'external',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/tools/pages/external-redirect/external-redirect.module').then(
        m => m.ExternalRedirectModule,
      ),
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'util',
    loadChildren: () => import('./pages/util/util.module').then(m => m.UtilModule),
  },
  {
    path: 'unauthorized',
    loadChildren: () =>
      import('./pages/unauthorized/unauthorized.module').then(m => m.UnauthroizedModule),
  },
  /** Old app redirects. */
  {
    path: 'support/ticket-app/title/:title',
    redirectTo: '/ticket-app/title/:title',
  },
  {
    path: 'support/ticket-app/title',
    redirectTo: '/ticket-app/title',
  },
  {
    path: 'support/ticket-app/',
    redirectTo: '/ticket-app/title',
  },
  {
    path: 'support/navbar-app/tools/:tool/:title',
    redirectTo: '/app/tools/:tool/:title',
  },
  {
    path: 'support/navbar-app/tools/:tool',
    redirectTo: '/app/tools/:tool',
  },
  {
    path: 'community/community-app/tools/:tool/:title',
    redirectTo: '/app/tools/:tool/:title',
  },
  {
    path: 'community/community-app/tools/:tool',
    redirectTo: '/app/tools/:tool',
  },
  {
    path: 'data-pipeline/data-pipeline-app/tools/:tool/:title',
    redirectTo: '/app/tools/:tool/:title',
  },
  {
    path: 'data-pipeline/data-pipeline-app/tools/:tool',
    redirectTo: '/app/tools/:tool',
  },
  {
    path: '**',
    component: ErrorComponent,
  },
];

/** Defines the app router. */
@NgModule({
  imports: [
    TourMatMenuModule, // loaded to ensure tours run properly
    RouterModule.forRoot(routes, {
      useHash: false,
      onSameUrlNavigation: 'reload',
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'legacy',
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
