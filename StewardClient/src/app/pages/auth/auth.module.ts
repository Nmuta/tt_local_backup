import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { AuthRouterModule } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AadLoginComponent } from './aad-login/aad-login.component';
import { AadLogoutComponent } from './aad-logout/aad-logout.component';
import { StuckModule } from '@shared/views/stuck/stuck.module';

/** Defines the auth module. */
@NgModule({
  imports: [CommonModule, AuthRouterModule, StuckModule],
  declarations: [AuthComponent, LoginComponent, LogoutComponent, AadLoginComponent, AadLogoutComponent],
})
export class AuthModule {}
