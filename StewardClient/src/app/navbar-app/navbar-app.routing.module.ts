import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavbarAppComponent } from './navbar-app.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarAppComponent,
  },
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavbarAppRouterModule {}
