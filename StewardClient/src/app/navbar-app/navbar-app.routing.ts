import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarTools } from '@components/navbar/navbar-tool-list';
import { ErrorComponent } from 'app/error/error.component';
import { GiftingPageComponent } from './gifting-page/gifting-page.module';
import { HomeComponent } from './home/home.component';

import { NavbarAppComponent } from './navbar-app.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarAppComponent,
    children: [
      {
        path: '',
        redirectTo: NavbarTools.HomePage.path,
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: NavbarTools.GiftingPage.path,
        component: GiftingPageComponent,
      }
    ]
  },
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavbarAppRouterModule {}
