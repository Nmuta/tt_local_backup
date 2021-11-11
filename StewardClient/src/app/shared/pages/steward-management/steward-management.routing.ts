import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StewardManagementComponent } from './steward-management.component';

const routes: Routes = [
  {
    path: '',
    component: StewardManagementComponent,
  },
];

/** Defines the Steward management routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StewardManagementRoutingModule {}
