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
import { CommunityAppComponent } from './community-app.component';
import { CommunityAppRouterModule } from './community-app.routing';
import { CommunityHomeComponent } from './pages/home/home.component';
import { CommunityNavbarComponent } from './components/navbar/navbar.component';

/** Defines the sidebar module. */
@NgModule({
  imports: [
    CommonModule,
    DataPrivacyNoticeModule,
    SidebarsModule,
    CommunityAppRouterModule,
    FontAwesomeModule,
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
  declarations: [CommunityAppComponent, CommunityHomeComponent, CommunityNavbarComponent],
})
export class CommunityAppModule {}
