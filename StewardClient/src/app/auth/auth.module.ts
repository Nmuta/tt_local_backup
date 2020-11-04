import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarModule } from '@components/navbar/navbar.module';

import { AuthComponent } from './auth.component';
import { AuthRouterModule } from './auth.routing.module';

/** Defines the auth module. */
@NgModule({
  imports: [CommonModule, AuthRouterModule, NavbarModule],
  declarations: [AuthComponent],
})
export class AuthModule {}
