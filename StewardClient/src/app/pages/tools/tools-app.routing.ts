import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { sidebarRoutes } from 'app/sidebars/sidebars.module';
import { FourOhFourComponent } from '@shared/views/four-oh-four/four-oh-four.component';
import { AuthGuard } from 'app/route-guards/auth.guard';
import { ToolsAppComponent } from './tools-app.component';
import { ToolsAppHomeComponent } from './pages/home/home.component';
import { toolList } from '@environments/environment';
import { FindUserRoleGuard } from 'app/route-guards/user-role.guards';

const routes: Routes = [
  {
    path: 'tools',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: ToolsAppComponent,
    children: [
      {
        path: '',
        redirectTo: '/app/tools/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: ToolsAppHomeComponent,
      },
      ...toolList.map(tool => {
        return <Route>{
          path: tool.tool,
          loadChildren: tool.loadChildren,
          canActivate: [AuthGuard, FindUserRoleGuard(tool.accessList)],
          canActivateChild: [AuthGuard],
        };
      }),
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
export class ToolsAppRouterModule {}
