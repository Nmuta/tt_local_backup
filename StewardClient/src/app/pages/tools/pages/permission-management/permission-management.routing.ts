import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionManagementComponent } from './permission-management.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionManagementComponent,
  },
];

/** Defines the Steward permission management routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermisisionManagementRoutingModule {}
