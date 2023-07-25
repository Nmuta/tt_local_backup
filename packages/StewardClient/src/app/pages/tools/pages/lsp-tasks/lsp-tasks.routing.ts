import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LspTasksComponent } from './lsp-tasks.component';
import { TitleMemoryRedirectGuard } from 'app/route-guards/title-memory-redirect.guard';
import { TitleMemorySetGuard } from 'app/route-guards/title-memory-set.guard';
import { SteelheadLspTaskManagementComponent } from './components/steelhead/steelhead-lsp-task-management.component';
import { WoodstockLspTaskManagementComponent } from './components/woodstock/woodstock-lsp-task-management.component';

const routes: Routes = [
  {
    path: '',
    component: LspTasksComponent,
    data: { tool: 'lspTasks' },
    children: [
      {
        path: '',
        canActivate: [TitleMemoryRedirectGuard],
        pathMatch: 'full',
      },
      {
        path: 'steelhead',
        canActivate: [TitleMemorySetGuard],
        component: SteelheadLspTaskManagementComponent,
        pathMatch: 'full',
      },
      {
        path: 'woodstock',
        canActivate: [TitleMemorySetGuard],
        component: WoodstockLspTaskManagementComponent,
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
export class LspTasksRoutingModule {}
