import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarTools } from 'app/pages/navbar-app/components/navbar/navbar-tool-list';
import { FourOhFourComponent } from 'app/four-oh-four/four-oh-four.component';

import { HomeComponent } from './pages/home/home.component';
import { NavbarAppComponent } from './navbar-app.component';
import { ErrorComponent } from 'app/error/error.component';
import { ProfileComponent } from 'app/profile/profile.component';

const routes: Routes = [
  {
    path: 'navbar-app',
    component: NavbarAppComponent,
    children: [
      {
        path: '',
        redirectTo: NavbarTools.HomePage.path,
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        outlet: 'sidebar',
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
