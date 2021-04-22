import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveOpsGuard } from 'app/route-guards/live-ops.guard';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { ApolloGiftingComponent } from './apollo/apollo-gifting.component';

import { GiftingComponent } from './gifting.component';
import { GravityGiftingComponent } from './gravity/gravity-gifting.component';
import { SteelheadGiftingComponent } from './steelhead/steelhead-gifting.component';
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
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [LiveOpsGuard, TitleMemorySetGuard], // TODO: Remove LiveOpsGuard when Steelhead is ready
        component: SteelheadGiftingComponent,
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
    ],
  },
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftingRouterModule {}
