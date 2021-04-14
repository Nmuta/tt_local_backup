import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidebarIconsComponent } from './sidebar-icons.component';
import { MatBadgeModule } from '@angular/material/badge';

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
  ],
  exports: [SidebarIconsComponent],
})
export class SidebarIconsModule {}
