import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TicketSidebarComponent } from './ticket-sidebar.cmpt';

const routes: Routes = [
    {
        path: '',
        component: TicketSidebarComponent,
    }
];

/** Defines the ticket sidebar routing module. */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketSidebarRouterModule {}
