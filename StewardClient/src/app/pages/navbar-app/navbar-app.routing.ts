import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarTools } from 'app/pages/navbar-app/navbar-tool-list';

import { HomeComponent } from './pages/home/home.component';
import { NavbarAppComponent } from './navbar-app.component';
import { sidebarRoutes } from 'app/sidebars/sidebars.module';
import { FourOhFourComponent } from '@shared/views/four-oh-four/four-oh-four.component';
import { AuthGuard } from 'app/route-guards/auth.guard';

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
        path: NavbarTools.UserDetailsPage.path,
        loadChildren: () =>
          import('./pages/user-details/user-details.module').then(m => m.UserDetailsModule),
      },
      {
        path: NavbarTools.GiftingPage.path,
        loadChildren: () =>
          import('../../shared/pages/gifting/gifting.module').then(m => m.GiftingsModule),
      },
      {
        path: NavbarTools.GiftHistoryPage.path,
        loadChildren: () =>
          import('./pages/gift-history/gift-history.module').then(m => m.GiftHistoryModule),
      },
      {
        path: NavbarTools.UserBanningPage.path,
        loadChildren: () =>
          import('./pages/user-banning/user-banning.module').then(m => m.UserBanningModule),
      },
      {
        path: NavbarTools.KustoPage.path,
        loadChildren: () => import('./pages/kusto/kusto.module').then(m => m.KustoModule),
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
