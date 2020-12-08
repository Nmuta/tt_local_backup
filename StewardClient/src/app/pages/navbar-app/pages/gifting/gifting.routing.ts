import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApolloGiftingComponent } from './apollo/apollo-gifting.component';

import { GiftingComponent } from './gifting.component';
import { GravityGiftingComponent } from './gravity/gravity-gifting.component';
import { OpusGiftingComponent } from './opus/opus-gifting.component';
import { SunriseGiftingComponent } from './sunrise/sunrise-gifting.component';

const routes: Routes = [
  {
    path: '',
    component: GiftingComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
      },
      {
        path: 'gravity',
        component: GravityGiftingComponent,
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        component: SunriseGiftingComponent,
        pathMatch: 'full',
      },
      {
        path: 'apollo',
        component: ApolloGiftingComponent,
        pathMatch: 'full',
      },
      {
        path: 'opus',
        component: OpusGiftingComponent,
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
