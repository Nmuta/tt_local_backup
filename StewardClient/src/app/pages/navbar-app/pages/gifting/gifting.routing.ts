import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GiftingComponent } from './gifting.component';

const routes: Routes = [
  {
    path: '',
    component: GiftingComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
      },
    ],
  },
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftingRouterModule {}
