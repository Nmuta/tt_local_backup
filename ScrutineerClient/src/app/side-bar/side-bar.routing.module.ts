import { Routes, RouterModule } from '@angular/router';
import { SidebarComponent } from './side-bar.cmpt';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: SidebarComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SidebarRouterModule {}
