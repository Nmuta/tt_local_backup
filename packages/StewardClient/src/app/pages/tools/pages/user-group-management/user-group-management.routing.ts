import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  TitleMemoryRedirectGuard,
  TitleMemoryRedirectLandingComponent,
  TitleMemorySetGuard,
} from 'app/route-guards';
import { UserGroupManagementComponent } from './user-group-management.component';
import { WoodstockUserGroupManagementComponent } from './woodstock/woodstock-user-group-management.component';
import { SteelheadUserGroupManagementComponent } from './steelhead/steelhead-user-group-management.component';
import { SunriseUserGroupManagementComponent } from './sunrise/sunrise-user-group-management.component';
import { ApolloUserGroupManagementComponent } from './apollo/apollo-user-group-management.component';

const routes: Routes = [
  {
    path: '',
    component: UserGroupManagementComponent,
    data: { tool: 'userGroupManagement' },
    children: [
      {
        path: '',
        component: TitleMemoryRedirectLandingComponent,
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockUserGroupManagementComponent,
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [TitleMemorySetGuard],
        component: SteelheadUserGroupManagementComponent,
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [TitleMemorySetGuard],
        component: SunriseUserGroupManagementComponent,
        pathMatch: 'full',
      },
      {
        path: 'apollo',
        canActivate: [TitleMemorySetGuard],
        component: ApolloUserGroupManagementComponent,
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
export class UserGroupManagementRouterModule {}
