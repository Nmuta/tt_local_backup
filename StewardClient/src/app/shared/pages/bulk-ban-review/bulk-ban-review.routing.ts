import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkBanReviewComponent } from './bulk-ban-review.component';

const routes: Routes = [
  {
    path: '',
    component: BulkBanReviewComponent,
    data: {},
  },
];

/** Defines the user background history routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkBanReviewRouterModule {}
