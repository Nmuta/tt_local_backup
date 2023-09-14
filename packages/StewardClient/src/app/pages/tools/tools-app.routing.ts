import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Route, RouterModule, Routes } from '@angular/router';
import { FourOhFourComponent } from '@shared/views/four-oh-four/four-oh-four.component';
import { AuthGuard } from 'app/route-guards/auth.guard';
import { ToolsAppComponent } from './tools-app.component';
import { ToolsAppHomeComponent } from './pages/home/home.component';
import {
  environment,
  HomeTileInfo,
  isHomeTileInfoExternal,
  isHomeTileInfoInternal,
} from '@environments/environment';
import { HomeTileInfoExternal, HomeTileInfoInternal } from '@environments/environment.dev';
import { chain } from 'lodash';
import { AuthV2Guard } from 'app/route-guards/auth-v2.guard';
import { RedirectionLandingComponent } from '../redirection-landing/redirection-landing.component';
import { sidebarRoutes } from 'app/sidebars/sidebars.routing';

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
      // internal tools
      ...environment.tools
        .filter(tool => isHomeTileInfoInternal(tool))
        .map((tool: HomeTileInfoInternal) => {
          return <Route>{
            path: tool.tool,
            loadChildren: tool.loadChildren,
            canActivate: [AuthGuard, AuthV2Guard],
            canActivateChild: [AuthGuard, AuthV2Guard],
          };
        }),
      // tool redirects
      ...chain(environment.tools)
        .filter((tool: HomeTileInfo) => !!tool.oldToolRoutes)
        .flatMap((tool: HomeTileInfo) =>
          tool.oldToolRoutes.map(oldName => {
            return <Route>{
              path: oldName,
              redirectTo: tool.tool,
            };
          }),
        )
        .value(),
      // external tools
      ...environment.tools
        .filter(tool => isHomeTileInfoExternal(tool))
        .map((tool: HomeTileInfoExternal) => {
          return <Route>{
            path: tool.tool,
            component: RedirectionLandingComponent,
            resolve: { url: 'externalUrlRedirectResolver' },
            data: { externalUrl: tool.externalUrl },
            canActivate: [AuthGuard, AuthV2Guard],
            canActivateChild: [AuthGuard, AuthV2Guard],
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
  providers: [
    {
      provide: 'externalUrlRedirectResolver',
      useValue: (route: ActivatedRouteSnapshot) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.location.href = (route.data as any).externalUrl;
      },
    },
  ],
})
export class ToolsAppRouterModule {}
