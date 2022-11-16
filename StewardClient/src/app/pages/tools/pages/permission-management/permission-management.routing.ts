import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisisionManagementComponent } from './permission-management.component';

const routes: Routes = [
  {
    path: '',
    component: PermisisionManagementComponent,
  },
];

/** Defines the Steward permission management routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermisisionManagementRoutingModule {}
