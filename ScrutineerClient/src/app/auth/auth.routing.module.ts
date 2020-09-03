import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
  },
  {
    path: 'aad',
    component: AuthComponent,
    data: { from: 'aad' },
  },
  {
    path: 'logout',
    component: AuthComponent,
    data: { from: 'logout' },
  },
];

/** Defines the auth router module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouterModule {}
