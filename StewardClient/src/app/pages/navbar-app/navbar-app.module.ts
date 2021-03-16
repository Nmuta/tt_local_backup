import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SidebarsModule } from 'app/sidebars/sidebars.module';
import { HomeComponent } from '@navbar-app/pages/home/home.component';
import { NavbarAppComponent } from '@navbar-app/navbar-app.component';
import { NavbarAppRouterModule } from '@navbar-app/navbar-app.routing';
import { UserDetailsModule } from '@navbar-app/pages/user-details/user-details.module';
import { NavbarComponent } from '@navbar-app/components/navbar/navbar.component';
import { FourOhFourModule } from '@shared/views/four-oh-four/four-oh-four.module';
import { DataPrivacyNoticeModule } from '@shared/views/data-privacy-notice/data-privacy-notice.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

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
    MatTooltipModule,
    FontAwesomeModule,
    FourOhFourModule,
    MatCardModule,
  ],
  providers: [],
  declarations: [NavbarAppComponent, HomeComponent, NavbarComponent],
})
export class NavbarAppModule {}
