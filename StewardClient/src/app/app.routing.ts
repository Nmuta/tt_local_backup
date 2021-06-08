import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRole } from '@models/enums';

import { ErrorComponent } from './pages/error/error.component';
import { AuthGuard } from './route-guards/auth.guard';
import { FindUserRoleGuard } from './route-guards/user-role.guards';
import { ZendeskGuard } from './route-guards/zendesk.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'live-ops',
    canActivate: [AuthGuard, FindUserRoleGuard([UserRole.LiveOpsAdmin])],
    children: [
      {
        path: 'live-ops-app',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('./pages/live-ops-app/live-ops-app.module').then(m => m.LiveOpsAppModule),
      },
    ],
  },
  {
    path: 'support',
    canActivate: [
      AuthGuard,
      FindUserRoleGuard([
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
      ]),
    ],
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
    canActivate: [AuthGuard, FindUserRoleGuard([UserRole.LiveOpsAdmin, UserRole.CommunityManager])],
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
    canActivate: [
      AuthGuard,
      FindUserRoleGuard([
        UserRole.LiveOpsAdmin,
        UserRole.DataPipelineAdmin,
        UserRole.DataPipelineContributor,
        UserRole.DataPipelineRead,
      ]),
    ],
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
    path: 'util',
    loadChildren: () => import('./pages/util/util.module').then(m => m.UtilModule),
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
