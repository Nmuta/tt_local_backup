import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteMemoryRedirectGuard } from 'app/route-guards/route-memory/route-memory-redirect.guard';
import { RouteMemorySetGuard } from 'app/route-guards/route-memory/route-memory-set.guard';
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
        canActivate: [RouteMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [RouteMemorySetGuard],
        component: WoodstockGiftingComponent,
        pathMatch: 'full',
        children: [
          {
            path: ':liveryId',
            canActivate: [RouteMemorySetGuard],
            component: WoodstockGiftingComponent,
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'steelhead',
        canActivate: [RouteMemorySetGuard],
        component: SteelheadGiftingComponent,
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [RouteMemorySetGuard],
        component: SunriseGiftingComponent,
        pathMatch: 'full',
      },
      {
        path: 'apollo',
        canActivate: [RouteMemorySetGuard],
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
