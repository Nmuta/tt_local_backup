import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { AuctionComponent } from './auction.component';
import { SunriseAuctionComponent } from './sunrise-auction/sunrise-auction.component';
import { WaitingForInputComponent } from './waiting-for-input/waiting-for-input.component';
import { WoodstockAuctionComponent } from './woodstock-auction/woodstock-auction.component';

const routes: Routes = [
  {
    path: '',
    component: AuctionComponent,
    data: { tool: 'auctionDetails' },
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
            component: SunriseAuctionComponent,
            pathMatch: 'full',
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
            component: WoodstockAuctionComponent,
            pathMatch: 'full',
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
