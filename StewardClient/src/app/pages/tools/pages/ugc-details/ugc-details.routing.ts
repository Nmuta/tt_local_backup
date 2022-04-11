import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { UgcDetailsComponent } from './ugc-details.component';
import { WaitingForInputComponent } from './pages/waiting-for-input/waiting-for-input.component';
import { WoodstockUgcDetailsComponent } from './pages/woodstock/woodstock-ugc-details.component';
import { SunriseUgcDetailsComponent } from './pages/sunrise/sunrise-ugc-details.component';
import { WoodstockLookupComponent } from './pages/woodstock-lookup/woodstock-lookup.component';
import { SunriseLookupComponent } from './pages/sunrise-lookup/sunrise-lookup.component';
import { WoodstockRedirectComponent } from './pages/woodstock-redirect/woodstock-redirect.component';
import { SunriseRedirectComponent } from './pages/sunrise-redirect/sunrise-redirect.component';

const routes: Routes = [
  {
    path: '',
    component: UgcDetailsComponent,
    data: { tool: 'ugcDetails' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [TitleMemorySetGuard],
        children: [
          {
            path: '',
            component: WaitingForInputComponent,
            pathMatch: 'full',
          },
          {
            path: ':id',
            canActivate: [TitleMemorySetGuard],
            component: SunriseUgcDetailsComponent,
            children: [
              {
                path: '',
                component: SunriseRedirectComponent,
                pathMatch: 'full',
              },
              {
                path: ':type',
                canActivate: [TitleMemorySetGuard],
                component: SunriseLookupComponent,
                pathMatch: 'full',
              },
            ],
          },
        ],
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        children: [
          {
            path: '',
            component: WaitingForInputComponent,
            pathMatch: 'full',
          },
          {
            path: ':id',
            canActivate: [TitleMemorySetGuard],
            component: WoodstockUgcDetailsComponent,
            children: [
              {
                path: '',
                component: WoodstockRedirectComponent,
                pathMatch: 'full',
              },
              {
                path: ':type',
                canActivate: [TitleMemorySetGuard],
                component: WoodstockLookupComponent,
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
