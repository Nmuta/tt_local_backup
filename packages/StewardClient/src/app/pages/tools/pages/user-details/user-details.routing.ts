import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  TitleMemoryRedirectGuard,
  TitleMemoryRedirectLandingComponent,
  TitleMemorySetGuard,
} from 'app/route-guards';
import { ApolloUserDetailsComponent } from './apollo/apollo-user-details.component';
import { OpusUserDetailsComponent } from './opus/opus-user-details.component';
import { SteelheadUserDetailsComponent } from './steelhead/steelhead-user-details.component';
import { SunriseUserDetailsComponent } from './sunrise/sunrise-user-details.component';
import { WoodstockUserDetailsComponent } from './woodstock/woodstock-user-details.component';
import { UserDetailsComponent } from './user-details.component';
import { GeneralUserDetailsComponent } from './general/general-user-details.component';
import { ForteUserDetailsComponent } from './forte/forte-user-details.component';

const routes: Routes = [
  {
    path: '',
    component: UserDetailsComponent,
    data: { tool: 'userDetails' },
    children: [
      {
        path: '',
        component: TitleMemoryRedirectLandingComponent,
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'forte',
        component: ForteUserDetailsComponent,
        canActivate: [TitleMemorySetGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        component: WoodstockUserDetailsComponent,
        canActivate: [TitleMemorySetGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        component: SteelheadUserDetailsComponent,
        canActivate: [TitleMemorySetGuard],
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        component: SunriseUserDetailsComponent,
        canActivate: [TitleMemorySetGuard],
        pathMatch: 'full',
      },
      {
        path: 'opus',
        component: OpusUserDetailsComponent,
        canActivate: [TitleMemorySetGuard],
        pathMatch: 'full',
      },
      {
        path: 'apollo',
        component: ApolloUserDetailsComponent,
        canActivate: [TitleMemorySetGuard],
        pathMatch: 'full',
      },
      {
        path: 'general',
        component: GeneralUserDetailsComponent,
        canActivate: [TitleMemorySetGuard],
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
export class UserDetailsRouterModule {}
