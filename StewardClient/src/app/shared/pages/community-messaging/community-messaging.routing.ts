import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { CommunityMessagingComponent } from './community-messaging.component';
import { SunriseCommunityMessagingComponent } from './sunrise/sunrise-community-messaging.component';
import { WoodstockCommunityMessagingComponent } from './woodstock/woodstock-community-messaging.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityMessagingComponent,
    data: { tool: 'messaging' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [TitleMemorySetGuard],
        component: SunriseCommunityMessagingComponent,
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockCommunityMessagingComponent,
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
export class CommunityMessagingRoutingModule {}
