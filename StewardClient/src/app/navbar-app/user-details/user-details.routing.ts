import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarTools } from '@components/navbar/navbar-tool-list';
import { FourOhFourComponent } from 'app/four-oh-four/four-oh-four.component';

import { SunriseComponent } from './sunrise/sunrise.component';
import { UserDetailsComponent } from './user-details.component';

const routes: Routes = [
  {
    path: '',
    component: UserDetailsComponent,
    children: [
      {
        path: '',
        redirectTo: 'sunrise',
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        component: SunriseComponent,
        pathMatch: 'full',
      },
      {
        path: '**',
        component: FourOhFourComponent,
        pathMatch: 'full',
      },
    ]
  },
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDetailsRouterModule {}
