import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { ApolloBanningComponent } from './apollo/apollo-banning.component';
import { GravityBanningComponent } from './gravity/gravity-banning.component';
import { OpusBanningComponent } from './opus/opus-banning.component';
import { SunriseBanningComponent } from './sunrise/sunrise-banning.component';
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
    ]
  }
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserBanningRoutingModule {}
