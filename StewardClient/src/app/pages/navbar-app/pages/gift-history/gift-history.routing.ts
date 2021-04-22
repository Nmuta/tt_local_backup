import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';

import { GiftHistoryComponent } from './gift-history.component';
import { ApolloGiftHistoryComponent } from './apollo/apollo-gift-history.component';
import { GravityGiftHistoryComponent } from './gravity/gravity-gift-history.component';
import { SunriseGiftHistoryComponent } from './sunrise/sunrise-gift-history.component';
import { SteelheadGiftHistoryComponent } from './steelhead/steelhead-gift-history.component';
import { LiveOpsGuard } from 'app/route-guards/live-ops.guard';

const routes: Routes = [
  {
    path: '',
    component: GiftHistoryComponent,
    data: { tool: 'giftHistory' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [LiveOpsGuard, TitleMemorySetGuard], // TODO: Remove LiveOpsGuard when Steelhead is ready
        component: SteelheadGiftHistoryComponent,
        pathMatch: 'full',
      },
      {
        path: 'gravity',
        canActivate: [TitleMemorySetGuard],
        component: GravityGiftHistoryComponent,
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [TitleMemorySetGuard],
        component: SunriseGiftHistoryComponent,
        pathMatch: 'full',
      },
      {
        path: 'apollo',
        canActivate: [TitleMemorySetGuard],
        component: ApolloGiftHistoryComponent,
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
export class GiftHistoryRouterModule {}
