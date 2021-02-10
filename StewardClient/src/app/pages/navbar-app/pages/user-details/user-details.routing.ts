import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApolloUserDetailsComponent } from './apollo/apollo-user-details.component';
import { GravityUserDetailsComponent } from './gravity/gravity-user-details.component';
import { OpusUserDetailsComponent } from './opus/opus-user-details.component';

import { SunriseUserDetailsComponent } from './sunrise/sunrise-user-details.component';
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
        component: SunriseUserDetailsComponent,
        pathMatch: 'full',
      },
      {
        path: 'opus',
        component: OpusUserDetailsComponent,
        pathMatch: 'full',
      },
      {
        path: 'apollo',
        component: ApolloUserDetailsComponent,
        pathMatch: 'full',
      },
      {
        path: 'gravity',
        component: GravityUserDetailsComponent,
        pathMatch: 'full',
      },
    ],
  },
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDetailsRouterModule {}
