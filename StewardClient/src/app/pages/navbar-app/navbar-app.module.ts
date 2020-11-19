import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HomeComponent } from './pages/home/home.component';
import { NavbarAppComponent } from './navbar-app.component';
import { NavbarAppRouterModule } from './navbar-app.routing';
import { UserDetailsModule } from './pages/user-details/user-details.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarsModule } from 'app/sidebars/sidebars.module';
import { FourOhFourModule } from '@shared/views/four-oh-four/four-oh-four.module';
import { DataPrivacyNoticeModule } from '@shared/views/data-privacy-notice/data-privacy-notice.module';

/** Defines the sidebar module. */
@NgModule({
  imports: [
    CommonModule,
    DataPrivacyNoticeModule,
    SidebarsModule,
    NavbarAppRouterModule,
    FontAwesomeModule,
    UserDetailsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FontAwesomeModule,
    FourOhFourModule,
  ],
  providers: [],
  declarations: [NavbarAppComponent, HomeComponent, NavbarComponent],
})
export class NavbarAppModule {}
