import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'sidebar',
        loadChildren: () => import('./side-bar/side-bar.module').then(m => m.SidebarModule)
    },
    {
        path: 'ticket-sidebar',
        loadChildren: () => import('./ticket-sidebar/ticket-sidebar.module').then(m => m.TicketSidebarModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    { path: '**', redirectTo: 'sidebar'  }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: false,
            onSameUrlNavigation: 'reload',
            initialNavigation: 'enabled',
            scrollPositionRestoration: 'top',
            anchorScrolling: 'enabled'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}