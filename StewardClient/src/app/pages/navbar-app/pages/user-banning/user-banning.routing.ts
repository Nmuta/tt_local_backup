import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { ApolloBanningComponent } from './pages/apollo/apollo-banning.component';
import { GravityBanningComponent } from './pages/gravity/gravity-banning.component';
import { OpusBanningComponent } from './pages/opus/opus-banning.component';
import { SunriseBanningComponent } from './pages/sunrise/sunrise-banning.component';
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
        path: 'gravity',
        canActivate: [TitleMemorySetGuard],
        component: GravityBanningComponent,
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
        path: 'opus',
        canActivate: [TitleMemorySetGuard],
        component: OpusBanningComponent,
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