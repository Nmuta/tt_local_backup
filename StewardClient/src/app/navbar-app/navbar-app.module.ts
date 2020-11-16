import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileModule } from '@shared/components/profile/profile.module';

import { HomeComponent } from './home/home.component';
import { NavbarAppComponent } from './navbar-app.component';
import { NavbarAppRouterModule } from './navbar-app.routing';
import { UserDetailsModule } from './user-details/user-details.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';

/** Defines the sidebar module. */
@NgModule({
  imports: [
    CommonModule,
    NavbarAppRouterModule,
    FontAwesomeModule,
    ProfileModule,
    UserDetailsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    ProfileModule,
    FontAwesomeModule,
  ],
  providers: [],
  declarations: [NavbarAppComponent, HomeComponent, NavbarComponent],
})
export class NavbarAppModule {}
