import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveOpsKustoComponent } from './kusto.component';

const routes: Routes = [
  {
    path: '',
    component: LiveOpsKustoComponent,
  },
];

/** Defines the kusto routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveOpsKustoRoutingModule {}
