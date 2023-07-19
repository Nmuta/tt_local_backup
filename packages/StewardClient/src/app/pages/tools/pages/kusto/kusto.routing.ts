import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KustoComponent } from './kusto.component';

const routes: Routes = [
  {
    path: '',
    component: KustoComponent,
  },
];

/** Defines the kusto routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KustoRoutingModule {}
