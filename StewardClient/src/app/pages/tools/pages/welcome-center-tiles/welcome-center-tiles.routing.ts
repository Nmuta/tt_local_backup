import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { WelcomeCenterTilesComponent } from './welcome-center-tiles.component';
import { SteelheadWelcomeCenterTilesComponent } from './steelhead/steelhead-welcome-center-tiles.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeCenterTilesComponent,
    data: { tool: 'welcomeCenterTiles' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [TitleMemorySetGuard],
        component: SteelheadWelcomeCenterTilesComponent,
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
export class WelcomeCenterTilesRouterModule {}
