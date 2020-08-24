import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.cmpt';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
    }
];

/** Defines the auth router module. */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRouterModule {}
