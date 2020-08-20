import { Routes, RouterModule } from '@angular/router';
import { TicketSidebarCmpt } from './ticket-sidebar.cmpt';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: TicketSidebarCmpt,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketSidebarRouterModule {}