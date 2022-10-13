import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataPrivacyNoticeModule } from '@shared/views/data-privacy-notice/data-privacy-notice.module';
import { LocationDetailsModule } from '@shared/views/location-details/location-details.module';
import { MatCardModule } from '@angular/material/card';
import { ChangelogModule } from '@views/old-changelog/old-changelog.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { HubsModule } from '@shared/hubs/hubs.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HideChangelogModalCheckboxModule } from '@views/hide-changelog-modal-checkbox/hide-changelog-modal-checkbox.module';
import { ThemeModule } from '@shared/modules/theme/theme.module';
import { ChangelogComponent } from './changelog/changelog.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { ChangelogGroupComponent } from './changelog/changelog-group/changelog-group.component';
import { ChangelogTagDetailsComponent } from './changelog/changelog-tag-details/changelog-tag-details.component';
import { MatChipsModule } from '@angular/material/chips';
import { PipesModule } from '@shared/pipes/pipes.module';

/** Routes for inclusion via ...sidebarRoutes in lazy-loaded child paths. */
export const sidebarRoutes = [
  {
    path: 'profile',
    component: ProfileComponent,
    outlet: 'sidebar',
  },
  {
    path: 'settings',
    component: SettingsComponent,
    outlet: 'sidebar',
  },
  {
    path: 'changelog',
    component: ChangelogComponent,
    outlet: 'sidebar',
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    outlet: 'sidebar',
  },
];

/** Module containing all routable sidebar components. */
@NgModule({
  declarations: [
    ProfileComponent,
    SettingsComponent,
    NotificationsComponent,
    ChangelogComponent,
    ChangelogGroupComponent,
    ChangelogTagDetailsComponent,
  ],
  imports: [
    ChangelogModule,
    CommonModule,
    DataPrivacyNoticeModule,
    DirectivesModule,
    FontAwesomeModule,
    FormsModule,
    HideChangelogModalCheckboxModule,
    HubsModule,
    LocationDetailsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatChipsModule,
    RouterModule.forChild(sidebarRoutes),
    ThemeModule,
    PipesModule,
  ],
  exports: [RouterModule],
})
export class SidebarsModule {}
