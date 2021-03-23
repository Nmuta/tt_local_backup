import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorComponent } from './pages/error/error.component';
import { AuthGuard } from './route-guards/auth.guard';
import { CommunityGuard } from './route-guards/community.guard';
import { DataPipelineGuard } from './route-guards/data-pipeline.guard';
import { SupportGuard } from './route-guards/support.guard';
import { ZendeskGuard } from './route-guards/zendesk.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'support',
    canActivate: [AuthGuard, SupportGuard],
    children: [
      {
        path: 'navbar-app',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('./pages/navbar-app/navbar-app.module').then(m => m.NavbarAppModule),
      },
      {
        path: 'ticket-app',
        canActivate: [AuthGuard, ZendeskGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('./pages/ticket-app/ticket-app.module').then(m => m.TicketAppModule),
      },
    ],
  },
  {
    path: 'community',
    canActivate: [AuthGuard, CommunityGuard],
    children: [
      {
        path: 'community-app',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('./pages/community-app/community-app.module').then(m => m.CommunityAppModule),
      },
    ],
  },
  {
    path: 'data-pipeline',
    canActivate: [AuthGuard, DataPipelineGuard],
    children: [
      {
        path: 'data-pipeline-app',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('./pages/data-pipeline-app/data-pipeline-app.module').then(
            m => m.DataPipelineAppModule,
          ),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'demo',
    loadChildren: () => import('./pages/demo/demo.module').then(m => m.DemoModule),
  },
  {
    path: 'unauthorized',
    loadChildren: () =>
      import('./pages/unauthorized/unauthorized.module').then(m => m.UnauthroizedModule),
  },
  {
    path: '**',
    component: ErrorComponent,
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
      relativeLinkResolution: 'legacy',
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
