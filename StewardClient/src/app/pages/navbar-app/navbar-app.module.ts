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
import { AllAppsDropdownModule } from '@shared/views/all-apps-dropdown/all-apps-dropdown.module';
import { MatBadgeModule } from '@angular/material/badge';
import { SidebarIconsModule } from '@shared/views/sidebar-icons/sidebar-icons.module';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

/** Defines the sidebar module. */
@NgModule({
  imports: [
    AllAppsDropdownModule,
    CommonModule,
    DataPrivacyNoticeModule,
    FontAwesomeModule,
    FontAwesomeModule,
    FourOhFourModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
    AllAppsDropdownModule,
    SidebarIconsModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    NavbarAppRouterModule,
    SidebarsModule,
    UserDetailsModule,
    MatCardModule,
    DragDropModule,
    MatCheckboxModule,
    FormsModule,
  ],
  providers: [],
  declarations: [NavbarAppComponent, HomeComponent, NavbarComponent],
})
export class NavbarAppModule {}
