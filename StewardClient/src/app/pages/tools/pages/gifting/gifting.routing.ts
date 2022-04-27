import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRole } from '@models/enums';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { FindUserRoleGuard } from 'app/route-guards/user-role.guards';
import { ApolloGiftingComponent } from './apollo/apollo-gifting.component';

import { GiftingComponent } from './gifting.component';
import { SteelheadGiftingComponent } from './steelhead/steelhead-gifting.component';
import { SunriseGiftingComponent } from './sunrise/sunrise-gifting.component';
import { WoodstockGiftingComponent } from './woodstock/woodstock-gifting.component';

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
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockGiftingComponent,
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [
          TitleMemorySetGuard,
          FindUserRoleGuard([UserRole.LiveOpsAdmin]), // TODO: Remove FindUserRoleGuard when Steelhead is ready
        ],
        component: SteelheadGiftingComponent,
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
