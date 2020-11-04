import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TicketAppComponent } from './ticket-app.component';

const routes: Routes = [
  {
    path: '',
    component: TicketAppComponent,
  },
];

/** Defines the ticket sidebar routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketAppRouterModule {}
