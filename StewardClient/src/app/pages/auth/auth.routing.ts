import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AadLoginComponent } from './aad-login/aad-login.component';
import { AadLogoutComponent } from './aad-logout/aad-logout.component';

import { LoginComponent } from './login/login.component';
import { LogoutIframeComponent } from './logout-iframe/logout-iframe.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'aad-login',
        component: AadLoginComponent,
      },
      {
        path: 'aad-logout',
        component: AadLogoutComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'logout-iframe',
        component: LogoutIframeComponent,
      },
    ],
  },
];

/** Defines the auth router module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouterModule {}
