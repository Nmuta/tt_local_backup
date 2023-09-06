import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  TitleMemoryRedirectGuard,
  TitleMemoryRedirectLandingComponent,
  TitleMemorySetGuard,
} from 'app/route-guards';
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
        component: TitleMemoryRedirectLandingComponent,
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
