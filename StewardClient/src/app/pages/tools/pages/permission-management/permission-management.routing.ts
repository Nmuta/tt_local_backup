import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamPermissionManagementComponent } from './components/team-permission-management/team-permission-management.component';
import { UserPermissionManagementComponent } from './components/user-permission-management/user-permission-management.component';
import { PermissionManagementComponent } from './permission-management.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UserPermissionManagementComponent,
        pathMatch: 'full',
      },
      {
        path: 'teams',
        component: TeamPermissionManagementComponent,
        pathMatch: 'full',
      },
    ],
  },
];

/** Defines the Steward permission management routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermisisionManagementRoutingModule {}
