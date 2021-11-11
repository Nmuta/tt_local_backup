import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { sidebarRoutes } from 'app/sidebars/sidebars.module';
import { FourOhFourComponent } from '@shared/views/four-oh-four/four-oh-four.component';
import { AuthGuard } from 'app/route-guards/auth.guard';
import { LiveOpsAppComponent } from './live-ops-app.component';
import { LiveOpsAppTools } from './live-ops-tool-list';
import { LiveOpsHomeComponent } from './pages/home/home.component';
import { SharedNavbarTools } from '@shared/pages/shared-tool-list';

const routes: Routes = [
  {
    path: 'tools',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LiveOpsAppComponent,
    children: [
      {
        path: '',
        redirectTo: LiveOpsAppTools.HomePage.path,
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: LiveOpsHomeComponent,
      },
      {
        path: SharedNavbarTools.KustoManagementPage.path,
        loadChildren: () =>
          import('../../shared/pages/steward-management/steward-management.module').then(
            m => m.StewardManagementModule,
          ),
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
export class LiveOpsAppRouterModule {}
