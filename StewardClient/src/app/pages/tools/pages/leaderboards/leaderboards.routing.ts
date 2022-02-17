import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { LeaderboardsComponent } from './leaderboards.component';
import { WoodstockLeaderboardsComponent } from './woodstock/woodstock-leaderboards.component';

const routes: Routes = [
  {
    path: '',
    component: LeaderboardsComponent,
    data: { tool: 'leaderboards' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockLeaderboardsComponent,
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
