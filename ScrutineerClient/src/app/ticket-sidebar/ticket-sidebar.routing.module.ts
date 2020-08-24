import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TicketSidebarComponent } from './ticket-sidebar.cmpt';

const routes: Routes = [
    {
        path: '',
        component: TicketSidebarComponent,
    }
];

/** Ticket Sidebar routing module */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketSidebarRouterModule {}
