import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';

import { GiftHistoryComponent } from './gift-history.component';
import { ApolloGiftHistoryComponent } from './apollo/apollo-gift-history.component';
import { SunriseGiftHistoryComponent } from './sunrise/sunrise-gift-history.component';
import { SteelheadGiftHistoryComponent } from './steelhead/steelhead-gift-history.component';
import { WoodstockGiftHistoryComponent } from './woodstock/woodstock-gift-history.component';
import { FindUserRoleGuard } from 'app/route-guards/user-role.guards';
import { UserRole } from '@models/enums';

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
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockGiftHistoryComponent,
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [
          TitleMemorySetGuard,
          FindUserRoleGuard([UserRole.LiveOpsAdmin]), // TODO: Remove FindUserRoleGuard when Steelhead is ready
        ],
        component: SteelheadGiftHistoryComponent,
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
