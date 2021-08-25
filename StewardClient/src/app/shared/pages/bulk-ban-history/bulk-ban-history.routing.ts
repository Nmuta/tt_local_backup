import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkBanHistoryComponent } from './bulk-ban-history.component';

const routes: Routes = [
  {
    path: '',
    component: BulkBanHistoryComponent,
    data: {},
  },
];

/** Defines the user background history routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkBanHistoryRouterModule {}
