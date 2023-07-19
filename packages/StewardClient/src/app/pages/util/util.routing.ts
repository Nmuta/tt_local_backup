import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilComponent } from './util.component';
import { demoRoutes } from './util.routes';

export const routes: Routes = [
  {
    path: '',
    component: UtilComponent,
    children: demoRoutes,
  },
];

/** Defines the demo router module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRouterModule {}
