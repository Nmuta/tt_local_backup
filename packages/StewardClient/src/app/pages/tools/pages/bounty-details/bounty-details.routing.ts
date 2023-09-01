import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SteelheadBountyDetailsComponent } from './pages/steelhead/steelhead-bounty-details.component';
import { BountyDetailsComponent } from './bounty-details.component';
import { RouteMemoryRedirectGuard, RouteMemorySetGuard, TitleMemoryRedirectLandingComponent } from 'app/route-guards';
import { PathParams } from '@models/path-params';

const routes: Routes = [
  {
    path: '',
    component: BountyDetailsComponent,
    data: { tool: 'bountyDetails' },
    children: [
      {
        path: '',
        component: TitleMemoryRedirectLandingComponent,
        canActivate: [RouteMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [RouteMemorySetGuard],
        children: [
          {
            path: '',
            component: SteelheadBountyDetailsComponent,
            pathMatch: 'full',
          },
          {
            path: `:${PathParams.BountyId}`,
            canActivate: [RouteMemorySetGuard],
            component: SteelheadBountyDetailsComponent,
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BountyDetailsRoutingModule {}
