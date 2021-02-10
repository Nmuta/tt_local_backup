import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApolloComponent } from './apollo/apollo-user-details.component';
import { GravityComponent } from './gravity/gravity-user-details.component';
import { OpusComponent } from './opus/opus-user-details.component';

import { SunriseComponent } from './sunrise/sunrise-user-details.component';
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
        path: 'opus',
        component: OpusComponent,
        pathMatch: 'full',
      },
      {
        path: 'apollo',
        component: ApolloComponent,
        pathMatch: 'full',
      },
      {
        path: 'gravity',
        component: GravityComponent,
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
