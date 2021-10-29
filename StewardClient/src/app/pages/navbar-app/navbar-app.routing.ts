import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarTools } from '@navbar-app/navbar-tool-list';

import { HomeComponent } from './pages/home/home.component';
import { NavbarAppComponent } from './navbar-app.component';
import { sidebarRoutes } from 'app/sidebars/sidebars.module';
import { FourOhFourComponent } from '@shared/views/four-oh-four/four-oh-four.component';
import { AuthGuard } from 'app/route-guards/auth.guard';
import { SharedNavbarTools } from '@shared/pages/shared-tool-list';
import { FindUserRoleGuard } from 'app/route-guards/user-role.guards';
import { UserRole } from '@models/enums';

const routes: Routes = [
  {
    path: 'tools',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: NavbarAppComponent,
    children: [
      {
        path: '',
        redirectTo: NavbarTools.HomePage.path,
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: SharedNavbarTools.StewardUserHistoryPage.path,
        loadChildren: () =>
          import('../../shared/pages/steward-user-history/steward-user-history.module').then(
            m => m.StewardUserHistoryModule,
          ),
      },
      {
        path: SharedNavbarTools.UserDetailsPage.path,
        loadChildren: () =>
          import('../../shared/pages/user-details/user-details.module').then(
            m => m.UserDetailsModule,
          ),
      },
      {
        path: SharedNavbarTools.GiftingPage.path,
        loadChildren: () =>
          import('../../shared/pages/gifting/gifting.module').then(m => m.GiftingsModule),
      },
      {
        path: SharedNavbarTools.GiftHistoryPage.path,
        loadChildren: () =>
          import('../../shared/pages/gift-history/gift-history.module').then(
            m => m.GiftHistoryModule,
          ),
      },
      {
        path: SharedNavbarTools.UserBanningPage.path,
        loadChildren: () =>
          import('../../shared/pages/user-banning/user-banning.module').then(
            m => m.UserBanningModule,
          ),
      },
      {
        path: SharedNavbarTools.KustoPage.path,
        loadChildren: () =>
          import('../../shared/pages/kusto/kusto.module').then(m => m.KustoModule),
      },
      {
        path: SharedNavbarTools.AuctionBlocklistPage.path,
        loadChildren: () =>
          import('../../shared/pages/auction-blocklist/auction-blocklist.module').then(
            m => m.StewardAuctionBlocklistModule,
          ),
      },
      {
        path: SharedNavbarTools.NotificationsPage.path,
        canActivate: [FindUserRoleGuard([UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin])],
        loadChildren: () =>
          import('../../shared/pages/notifications/notifications.module').then(
            m => m.NotificationsModule,
          ),
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
export class NavbarAppRouterModule {}
