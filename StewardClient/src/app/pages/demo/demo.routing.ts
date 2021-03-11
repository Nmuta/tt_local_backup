import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './demo.component';
import { demoRoutes } from './demo.routes';

export const routes: Routes = [
  {
    path: '',
    component: DemoComponent,
    children: demoRoutes,
  },
];

/** Defines the demo router module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRouterModule {}
