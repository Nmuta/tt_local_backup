import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { sidebarRoutes } from 'app/sidebars/sidebars.module';
import { FourOhFourComponent } from '@shared/views/four-oh-four/four-oh-four.component';
import { AuthGuard } from 'app/route-guards/auth.guard';
import { DataPipelineAppComponent } from './data-pipeline-app.component';
import { DataPipelineAppTools } from './data-pipeline-tool-list';
import { DataPipelineHomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: 'tools',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: DataPipelineAppComponent,
    children: [
      {
        path: '',
        redirectTo: DataPipelineAppTools.HomePage.path,
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: DataPipelineHomeComponent,
      },
      {
        path: DataPipelineAppTools.ObligationPage.path,
        loadChildren: () =>
          import('./pages/obligation/obligation.module').then(m => m.DataPipelineObligationModule),
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
export class DataPipelineAppRouterModule {}
