import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteMemoryRedirectGuard } from 'app/route-guards/route-memory/route-memory-redirect.guard';
import { RouteMemorySetGuard } from 'app/route-guards/route-memory/route-memory-set.guard';
import { WoodstockPlayFabBuildsManagementComponent } from './components/playfab-builds-management/woodstock/woodstock-playfab-builds-management.component';
import { PlayFabSettingsComponent } from './components/playfab-settings/playfab-settings.component';
import { PlayFabComponent } from './playfab.component';
import { WoodstockPlayFabComponent } from './woodstock/woodstock-playfab.component';
import { FortePlayFabComponent } from './forte/forte-playfab.component';
import { FortePlayFabBuildsManagementComponent } from './components/playfab-builds-management/forte/forte-playfab-builds-management.component';

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
        children: [
          {
            path: '',
            redirectTo: 'manage-builds',
            pathMatch: 'full',
          },
          {
            path: 'manage-builds',
            canActivate: [RouteMemorySetGuard],
            component: WoodstockPlayFabBuildsManagementComponent,
            pathMatch: 'full',
          },
          {
            path: 'settings',
            canActivate: [RouteMemorySetGuard],
            component: PlayFabSettingsComponent,
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'forte',
        canActivate: [RouteMemorySetGuard],
        component: FortePlayFabComponent,
        children: [
          {
            path: '',
            redirectTo: 'manage-builds',
            pathMatch: 'full',
          },
          {
            path: 'manage-builds',
            canActivate: [RouteMemorySetGuard],
            component: FortePlayFabBuildsManagementComponent,
            pathMatch: 'full',
          },
          // {
          //   path: 'settings',
          //   canActivate: [RouteMemorySetGuard],
          //   component: PlayFabSettingsComponent,
          //   pathMatch: 'full',
          // },
        ],
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
