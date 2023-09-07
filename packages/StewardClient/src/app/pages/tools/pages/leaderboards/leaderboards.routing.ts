import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  TitleMemoryRedirectGuard,
  TitleMemoryRedirectLandingComponent,
  TitleMemorySetGuard,
} from 'app/route-guards';
import { LeaderboardsComponent } from './leaderboards.component';
import { SteelheadLeaderboardsComponent } from './steelhead/steelhead-leaderboards.component';
import { WoodstockLeaderboardsComponent } from './woodstock/woodstock-leaderboards.component';

const routes: Routes = [
  {
    path: '',
    component: LeaderboardsComponent,
    data: { tool: 'leaderboards' },
    children: [
      {
        path: '',
        component: TitleMemoryRedirectLandingComponent,
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockLeaderboardsComponent,
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [TitleMemorySetGuard],
        component: SteelheadLeaderboardsComponent,
        pathMatch: 'full',
      },
    ],
  },
];

/** Defines the Leaderboards routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaderboardsRoutingModule {}
