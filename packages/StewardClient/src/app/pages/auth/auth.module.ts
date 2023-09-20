import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';
import { StuckModule } from '@shared/views/stuck/stuck.module';
import { AadLoginComponent } from './aad-login/aad-login.component';
import { AadLogoutComponent } from './aad-logout/aad-logout.component';
import { AuthRouterModule } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { LogoutIframeComponent } from './logout-iframe/logout-iframe.component';
import { LogoutComponent } from './logout/logout.component';
import { SyncStateComponent } from './sync-state/sync-state.component';

/** Defines the auth module. */
@NgModule({
  imports: [CommonModule, AuthRouterModule, MatCardModule, StuckModule, CenterContentsModule],
  declarations: [
    LoginComponent,
    LogoutComponent,
    AadLoginComponent,
    AadLogoutComponent,
    LogoutIframeComponent,
    SyncStateComponent,
  ],
})
export class AuthModule {}
