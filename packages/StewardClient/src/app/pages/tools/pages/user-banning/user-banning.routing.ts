import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  TitleMemoryRedirectGuard,
  TitleMemoryRedirectLandingComponent,
  TitleMemorySetGuard,
} from 'app/route-guards';
import { ApolloBanningComponent } from './pages/apollo/apollo-banning.component';
import { ForumBanningComponent } from './pages/forum/forum-banning.component';
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
        component: TitleMemoryRedirectLandingComponent,
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockBanningComponent,
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [TitleMemorySetGuard],
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
      {
        path: 'forum',
        canActivate: [TitleMemorySetGuard],
        component: ForumBanningComponent,
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
