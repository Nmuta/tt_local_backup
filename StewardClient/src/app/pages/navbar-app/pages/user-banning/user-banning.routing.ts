import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveOpsGuard } from 'app/route-guards/live-ops.guard';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { ApolloBanningComponent } from './pages/apollo/apollo-banning.component';
import { SteelheadBanningComponent } from './pages/steelhead/steelhead-banning.component';
import { SunriseBanningComponent } from './pages/sunrise/sunrise-banning.component';
import { WoodstockBanningComponent } from './pages/woodstock/woodstock-banning.component';
import { UserBanningComponent } from './user-banning.component';

const routes: Routes = [
  {
    path: '',
    component: UserBanningComponent,
    data: { tool: 'banning' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [LiveOpsGuard, TitleMemorySetGuard], // TODO: Remove LiveOpsGuard when Woodstock is ready
        component: WoodstockBanningComponent,
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [LiveOpsGuard, TitleMemorySetGuard], // TODO: Remove LiveOpsGuard when Steelhead is ready
        component: SteelheadBanningComponent,
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [TitleMemorySetGuard],
        component: SunriseBanningComponent,
        pathMatch: 'full',
      },
      {
        path: 'apollo',
        canActivate: [TitleMemorySetGuard],
        component: ApolloBanningComponent,
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
export class UserBanningRoutingModule {}
