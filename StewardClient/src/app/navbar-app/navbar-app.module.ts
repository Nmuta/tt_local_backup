import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { NavbarModule } from '@components/navbar/navbar.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileModule } from '@shared/components/profile/profile.module';

import { NavbarAppComponent } from './navbar-app.component';
import { NavbarAppRouterModule } from './navbar-app.routing.module';

/** Defines the sidebar module. */
@NgModule({
  imports: [
    CommonModule,
    NavbarAppRouterModule,
    FontAwesomeModule,
    ProfileModule,
    NavbarModule,
  ],
  providers: [],
  declarations: [NavbarAppComponent],
})
export class NavbarAppModule {}
