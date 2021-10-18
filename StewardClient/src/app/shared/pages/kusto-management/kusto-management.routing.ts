import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KustoManagementComponent } from './kusto-management.component';

const routes: Routes = [
  {
    path: '',
    component: KustoManagementComponent,
  },
];

/** Defines the kusto management routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KustoManagementRoutingModule {}
