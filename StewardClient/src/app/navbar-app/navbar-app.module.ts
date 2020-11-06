import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarModule } from '@components/navbar/navbar.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileModule } from '@shared/components/profile/profile.module';

import { HomeComponent } from './home/home.component';
import { NavbarAppComponent } from './navbar-app.component';
import { NavbarAppRouterModule } from './navbar-app.routing';
import { UserDetailsModule } from './user-details/user-details.module';

/** Defines the sidebar module. */
@NgModule({
  imports: [
    CommonModule,
    NavbarAppRouterModule,
    FontAwesomeModule,
    ProfileModule,
    NavbarModule,
    UserDetailsModule,
  ],
  providers: [],
  declarations: [NavbarAppComponent, HomeComponent],
})
export class NavbarAppModule {}
