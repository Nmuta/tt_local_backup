import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataPipelineObligationComponent } from './obligation.component';

const routes: Routes = [
  {
    path: '',
    component: DataPipelineObligationComponent,
  },
];

/** Defines the kusto routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataPipelineObligationRoutingModule {}
