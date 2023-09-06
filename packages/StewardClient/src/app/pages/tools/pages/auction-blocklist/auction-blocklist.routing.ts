import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  TitleMemoryRedirectGuard,
  TitleMemoryRedirectLandingComponent,
  TitleMemorySetGuard,
} from 'app/route-guards';
import { AuctionBlocklistComponent } from './auction-blocklist.component';
import { SunriseAuctionBlocklistComponent } from './sunrise/sunrise-auction-blocklist.component';
import { WoodstockAuctionBlocklistComponent } from './woodstock/woodstock-auction-blocklist.component';

const routes: Routes = [
  {
    path: '',
    component: AuctionBlocklistComponent,
    data: { tool: 'auctionBlocklist' },
    children: [
      {
        path: '',
        component: TitleMemoryRedirectLandingComponent,
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [TitleMemorySetGuard],
        component: SunriseAuctionBlocklistComponent,
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockAuctionBlocklistComponent,
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
export class AuctionBlocklistRoutingModule {}
