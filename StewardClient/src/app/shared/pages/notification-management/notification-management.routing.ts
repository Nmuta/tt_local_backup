import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { NotificationManagementComponent } from './notification-management.component';
import { SunriseNotificationManagementComponent } from './sunrise/sunrise-notification-management.component';
import { WoodstockNotificationManagementComponent } from './woodstock/woodstock-notification-management.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationManagementComponent,
    data: { tool: 'notificationManagement' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'sunrise',
        canActivate: [TitleMemorySetGuard],
        component: SunriseNotificationManagementComponent,
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockNotificationManagementComponent,
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
export class NotificationManagementRoutingModule {}
