import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteMemoryRedirectGuard } from 'app/route-guards/route-memory/route-memory-redirect.guard';
import { RouteMemorySetGuard } from 'app/route-guards/route-memory/route-memory-set.guard';
import { PlayFabComponent } from './playfab.component';
import { WoodstockPlayFabComponent } from './woodstock/woodstock-playfab.component';

const routes: Routes = [
  {
    path: '',
    component: PlayFabComponent,
    data: { tool: 'playfab' },
    children: [
      {
        path: '',
        canActivate: [RouteMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [RouteMemorySetGuard],
        component: WoodstockPlayFabComponent,
        pathMatch: 'full',
      },
    ],
  },
];

/** Defines the Steward management routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayFabRoutingModule {}
