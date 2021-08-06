import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRole } from '@models/enums';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { FindUserRoleGuard } from 'app/route-guards/user-role.guards';
import { SunriseUGCComponent } from './pages/sunrise/sunrise-ugc.component';
import { WoodstockUGCComponent } from './pages/woodstock/woodstock-ugc.component';
import { UGCComponent } from './ugc.component';

const routes: Routes = [
  {
    path: '',
    component: UGCComponent,
    data: { tool: 'ugc' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [
          TitleMemorySetGuard,
          FindUserRoleGuard([UserRole.LiveOpsAdmin]), // TODO: Remove FindUserRoleGuard when Woodstock is ready
        ],
        component: WoodstockUGCComponent,
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [TitleMemorySetGuard],
        component: SunriseUGCComponent,
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
export class UGCRoutingModule {}
