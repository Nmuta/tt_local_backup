import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DataPrivacyNoticeModule } from '@shared/views/data-privacy-notice/data-privacy-notice.module';
import { LocationDetailsModule } from '@shared/views/location-details/location-details.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NotificationsComponent } from './notifications/notifications.component';
import { HubsModule } from '@shared/hubs/hubs.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { HideChangelogModalCheckboxModule } from '@views/hide-changelog-modal-checkbox/hide-changelog-modal-checkbox.module';
import { ThemeModule } from '@shared/modules/theme/theme.module';
import { ChangelogComponent } from './changelog/changelog.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { ChangelogGroupComponent } from './changelog/changelog-group/changelog-group.component';
import { ChangelogTagDetailsComponent } from './changelog/changelog-tag-details/changelog-tag-details.component';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HelpModule } from '@shared/modules/help/help.module';
import { SidebarsComponent } from './sidebars.component';
import { SidebarsRouterModule } from './sidebars.routing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatBadgeModule } from '@angular/material/badge';
import { EndpointsComponent } from './settings/endpoints/endpoints.component';
import { ExperienceComponent } from './settings/experience/experience.component';
import { ToursComponent } from './settings/tours/tours.component';

/** Module containing all routable sidebar components. */
@NgModule({
  declarations: [
    ProfileComponent,
    SettingsComponent,
    NotificationsComponent,
    ChangelogComponent,
    ChangelogGroupComponent,
    ChangelogTagDetailsComponent,
    ContactUsComponent,
    SidebarsComponent,
    EndpointsComponent,
    ExperienceComponent,
    ToursComponent,
  ],
  imports: [
    CommonModule,
    DataPrivacyNoticeModule,
    DirectivesModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatInputModule,
    SidebarsRouterModule,
    ThemeModule,
    PipesModule,
    MonitorActionModule,
    DirectivesModule,
    PipesModule,
    StateManagersModule,
    PermissionsModule,
    StandardCopyModule,
    MatButtonToggleModule,
    HelpModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
  ],
  exports: [RouterModule],
})
export class SidebarsModule {}
