import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  TitleMemoryRedirectGuard,
  TitleMemoryRedirectLandingComponent,
  TitleMemorySetGuard,
} from 'app/route-guards';
import { SteelheadSearchUgcComponent } from './pages/steelhead/steelhead-search-ugc.component';
import { WoodstockSearchUgcComponent } from './pages/woodstock/woodstock-search-ugc.component';
import { UgcComponent } from './ugc.component';

const routes: Routes = [
  {
    path: '',
    component: UgcComponent,
    data: { tool: 'ugc' },
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
        component: SteelheadSearchUgcComponent,
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockSearchUgcComponent,
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
export class UgcRoutingModule {}
