import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SidebarIconsComponent } from './sidebar-icons.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';

/** Module for a menu drop with links to all Steward apps. */
@NgModule({
  declarations: [SidebarIconsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    FontAwesomeModule,
    RouterModule,
    MatTooltipModule,
    MatBadgeModule,
    MatIconModule,
    MatMenuModule,
    TourMatMenuModule,
  ],
  exports: [SidebarIconsComponent],
})
export class SidebarIconsModule {}
