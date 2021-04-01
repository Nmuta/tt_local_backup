import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { ApolloUserDetailsComponent } from './apollo/apollo-user-details.component';
import { GravityUserDetailsComponent } from './gravity/gravity-user-details.component';
import { OpusUserDetailsComponent } from './opus/opus-user-details.component';

import { SunriseUserDetailsComponent } from './sunrise/sunrise-user-details.component';
import { UserDetailsComponent } from './user-details.component';

const routes: Routes = [
  {
    path: '',
    component: UserDetailsComponent,
    data: { tool: 'userDetails' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        component: SunriseUserDetailsComponent,
        canActivate: [TitleMemorySetGuard],
        pathMatch: 'full',
      },
      {
        path: 'opus',
        component: OpusUserDetailsComponent,
        canActivate: [TitleMemorySetGuard],
        pathMatch: 'full',
      },
      {
        path: 'apollo',
        component: ApolloUserDetailsComponent,
        canActivate: [TitleMemorySetGuard],
        pathMatch: 'full',
      },
      {
        path: 'gravity',
        component: GravityUserDetailsComponent,
        canActivate: [TitleMemorySetGuard],
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
