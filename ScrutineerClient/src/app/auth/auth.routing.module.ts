import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.cmpt';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRouterModule {}
