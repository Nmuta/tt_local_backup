import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { sidebarRoutes } from 'app/sidebars/sidebars.module';
import { FourOhFourComponent } from '@shared/views/four-oh-four/four-oh-four.component';
import { AuthGuard } from 'app/route-guards/auth.guard';
import { CommunityAppTools } from './community-tool-list';
import { CommunityAppComponent } from './community-app.component';
import { CommunityHomeComponent } from './pages/home/home.component';
import { SharedNavbarTools } from '@shared/pages/shared-tool-list';

const routes: Routes = [
  {
    path: 'tools',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: CommunityAppComponent,
    children: [
      {
        path: '',
        redirectTo: CommunityAppTools.HomePage.path,
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: CommunityHomeComponent,
      },
      {
        path: SharedNavbarTools.MessagingPage.path,
        loadChildren: () =>
          import('../../shared/pages/community-messaging/community-messaging.module').then(
            m => m.CommunityMessagingModule,
          ),
      },
      {
        path: SharedNavbarTools.GiftingPage.path,
        loadChildren: () =>
          import('../../shared/pages/gifting/gifting.module').then(m => m.GiftingsModule),
      },
      {
        path: CommunityAppTools.UGCPage.path,
        loadChildren: () => import('./pages/ugc/ugc.module').then(m => m.UGCModule),
      },
      ...sidebarRoutes,
      {
        path: '**',
        component: FourOhFourComponent,
      },
    ],
  },
];

/** Defines the sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityAppRouterModule {}
