import { Routes, RouterModule } from '@angular/router';
import { AuthCmpt } from './auth.cmpt';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: AuthCmpt,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRouterModule {}