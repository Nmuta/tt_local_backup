import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StewardUserHistoryComponent } from './steward-user-history.component';

const routes: Routes = [
  {
    path: '',
    component: StewardUserHistoryComponent,
    data: { tool: 'steward-user-history' },
  },
];

/** Defines the user background history routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StewardUserHistoryRouterModule {}
