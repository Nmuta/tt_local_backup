import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { ApolloGiftingComponent } from './apollo/apollo-gifting.component';

import { GiftingComponent } from './gifting.component';
import { GravityGiftingComponent } from './gravity/gravity-gifting.component';
import { OpusGiftingComponent } from './opus/opus-gifting.component';
import { SunriseGiftingComponent } from './sunrise/sunrise-gifting.component';

const routes: Routes = [
  {
    path: '',
    component: GiftingComponent,
    data: { tool: 'gifting' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        // redirectTo: 'gravity',
        pathMatch: 'full',
      },
      {
        path: 'gravity',
        canActivate: [TitleMemorySetGuard],
        component: GravityGiftingComponent,
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [TitleMemorySetGuard],
        component: SunriseGiftingComponent,
        pathMatch: 'full',
      },
      {
        path: 'apollo',
        canActivate: [TitleMemorySetGuard],
        component: ApolloGiftingComponent,
        pathMatch: 'full',
      },
      {
        path: 'opus',
        canActivate: [TitleMemorySetGuard],
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
