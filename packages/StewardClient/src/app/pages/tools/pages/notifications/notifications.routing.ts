import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { NotificationsComponent } from './notifications.component';
import { SteelheadNotificationsComponent } from './steelhead/steelhead-notifications.component';
import { SunriseNotificationsComponent } from './sunrise/sunrise-notifications.component';
import { WoodstockNotificationsComponent } from './woodstock/woodstock-notifications.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent,
    data: { tool: 'notifications' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [TitleMemorySetGuard],
        component: SteelheadNotificationsComponent,
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [TitleMemorySetGuard],
        component: SunriseNotificationsComponent,
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockNotificationsComponent,
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
export class NotificationsRoutingModule {}
