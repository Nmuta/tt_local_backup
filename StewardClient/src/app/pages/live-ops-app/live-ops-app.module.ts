import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SidebarsModule } from 'app/sidebars/sidebars.module';
import { FourOhFourModule } from '@shared/views/four-oh-four/four-oh-four.module';
import { DataPrivacyNoticeModule } from '@shared/views/data-privacy-notice/data-privacy-notice.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { LiveOpsAppRouterModule } from './live-ops-app.routing';
import { LiveOpsAppComponent } from './live-ops-app.component';
import { LiveOpsHomeComponent } from './pages/home/home.component';
import { LiveOpsNavbarComponent } from './components/navbar/navbar.component';
import { AllAppsDropdownModule } from '@shared/views/all-apps-dropdown/all-apps-dropdown.module';
import { SidebarIconsModule } from '@shared/views/sidebar-icons/sidebar-icons.module';

/** Defines the sidebar module. */
@NgModule({
  imports: [
    LiveOpsAppRouterModule,
    CommonModule,
    DataPrivacyNoticeModule,
    SidebarsModule,
    FontAwesomeModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FontAwesomeModule,
    FourOhFourModule,
    MatCardModule,
    AllAppsDropdownModule,
    SidebarIconsModule,
  ],
  providers: [],
  declarations: [LiveOpsAppComponent, LiveOpsHomeComponent, LiveOpsNavbarComponent],
})
export class LiveOpsAppModule {}
