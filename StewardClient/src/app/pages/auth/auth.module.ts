import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthRouterModule } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AadLoginComponent } from './aad-login/aad-login.component';
import { AadLogoutComponent } from './aad-logout/aad-logout.component';
import { StuckModule } from '@shared/views/stuck/stuck.module';
import { MatCardModule } from '@angular/material/card';
import { LogoutIframeComponent } from './logout-iframe/logout-iframe.component';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';

/** Defines the auth module. */
@NgModule({
  imports: [CommonModule, AuthRouterModule, MatCardModule, StuckModule, CenterContentsModule],
  declarations: [
    LoginComponent,
    LogoutComponent,
    AadLoginComponent,
    AadLogoutComponent,
    LogoutIframeComponent,
  ],
})
export class AuthModule {}
