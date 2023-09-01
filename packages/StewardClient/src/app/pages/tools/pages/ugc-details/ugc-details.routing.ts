import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteMemoryRedirectGuard } from 'app/route-guards/route-memory/route-memory-redirect.guard';
import { RouteMemorySetGuard } from 'app/route-guards/route-memory/route-memory-set.guard';
import { UgcDetailsComponent } from './ugc-details.component';
import { WaitingForInputComponent } from './pages/waiting-for-input/waiting-for-input.component';
import { WoodstockUgcDetailsComponent } from './pages/woodstock/woodstock-ugc-details.component';
import { SunriseUgcDetailsComponent } from './pages/sunrise/sunrise-ugc-details.component';
import { WoodstockLookupComponent } from './pages/woodstock-lookup/woodstock-lookup.component';
import { SunriseLookupComponent } from './pages/sunrise-lookup/sunrise-lookup.component';
import { WoodstockRedirectComponent } from './pages/woodstock-redirect/woodstock-redirect.component';
import { SunriseRedirectComponent } from './pages/sunrise-redirect/sunrise-redirect.component';
import { SteelheadLookupComponent } from './pages/steelhead-lookup/steelhead-lookup.component';
import { SteelheadRedirectComponent } from './pages/steelhead-redirect/steelhead-redirect.component';
import { SteelheadUgcDetailsComponent } from './pages/steelhead/steelhead-ugc-details.component';
import { TitleMemoryRedirectLandingComponent } from 'app/route-guards';

const routes: Routes = [
  {
    path: '',
    component: UgcDetailsComponent,
    data: { tool: 'ugcDetails' },
    children: [
      {
        path: '',
        component: TitleMemoryRedirectLandingComponent,
        canActivate: [RouteMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [RouteMemorySetGuard],
        children: [
          {
            path: '',
            component: WaitingForInputComponent,
            pathMatch: 'full',
          },
          {
            path: ':id',
            canActivate: [RouteMemorySetGuard],
            component: SunriseUgcDetailsComponent,
            children: [
              {
                path: '',
                component: SunriseRedirectComponent,
                pathMatch: 'full',
              },
              {
                path: ':type',
                canActivate: [RouteMemorySetGuard],
                component: SunriseLookupComponent,
                pathMatch: 'full',
              },
            ],
          },
        ],
      },
      {
        path: 'woodstock',
        canActivate: [RouteMemorySetGuard],
        children: [
          {
            path: '',
            component: WaitingForInputComponent,
            pathMatch: 'full',
          },
          {
            path: ':id',
            canActivate: [RouteMemorySetGuard],
            component: WoodstockUgcDetailsComponent,
            children: [
              {
                path: '',
                component: WoodstockRedirectComponent,
                pathMatch: 'full',
              },
              {
                path: ':type',
                canActivate: [RouteMemorySetGuard],
                component: WoodstockLookupComponent,
                pathMatch: 'full',
              },
            ],
          },
        ],
      },
      {
        path: 'steelhead',
        canActivate: [RouteMemorySetGuard],
        children: [
          {
            path: '',
            component: WaitingForInputComponent,
            pathMatch: 'full',
          },
          {
            path: ':id',
            canActivate: [RouteMemorySetGuard],
            component: SteelheadUgcDetailsComponent,
            children: [
              {
                path: '',
                component: SteelheadRedirectComponent,
                pathMatch: 'full',
              },
              {
                path: ':type',
                canActivate: [RouteMemorySetGuard],
                component: SteelheadLookupComponent,
                pathMatch: 'full',
              },
            ],
          },
        ],
      },
    ],
  },
];

/** Defines the auction tool routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionRoutingModule {}
