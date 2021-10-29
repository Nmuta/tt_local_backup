import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { sidebarRoutes } from 'app/sidebars/sidebars.module';
import { FourOhFourComponent } from '@shared/views/four-oh-four/four-oh-four.component';
import { AuthGuard } from 'app/route-guards/auth.guard';
import { CommunityAppTools } from './community-tool-list';
import { CommunityAppComponent } from './community-app.component';
import { CommunityHomeComponent } from './pages/home/home.component';
import { SharedNavbarTools } from '@shared/pages/shared-tool-list';

const routes: Routes = [
  {
    path: 'tools',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: CommunityAppComponent,
    children: [
      {
        path: '',
        redirectTo: CommunityAppTools.HomePage.path,
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: CommunityHomeComponent,
      },
      {
        path: SharedNavbarTools.NotificationsPage.path,
        loadChildren: () =>
          import('../../shared/pages/notifications/notifications.module').then(
            m => m.NotificationsModule,
          ),
      },
      {
        path: SharedNavbarTools.GiftingPage.path,
        loadChildren: () =>
          import('../../shared/pages/gifting/gifting.module').then(m => m.GiftingsModule),
      },
      {
        path: SharedNavbarTools.UGCPage.path,
        loadChildren: () => import('../../shared/pages/ugc/ugc.module').then(m => m.UGCModule),
      },
      {
        path: SharedNavbarTools.BulkBanHistoryPage.path,
        loadChildren: () =>
          import('../../shared/pages/bulk-ban-history/bulk-ban-history.module').then(
            m => m.BulkBanHistoryModule,
          ),
      },
      ...sidebarRoutes,
      {
        path: '**',
        component: FourOhFourComponent,
      },
    ],
  },
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityAppRouterModule {}
