import { Routes, RouterModule } from '@angular/router';
import { TicketSidebarComponent } from './ticket-sidebar.cmpt';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: TicketSidebarComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketSidebarRouterModule {}
