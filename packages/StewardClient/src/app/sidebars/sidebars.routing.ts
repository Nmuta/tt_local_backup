import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SidebarsComponent } from './sidebars.component';
import { EndpointsComponent } from './settings/endpoints/endpoints.component';
import { ExperienceComponent } from './settings/experience/experience.component';
import { ToursComponent } from './settings/tours/tours.component';

/**
 * Routes that are considered "settings" configuration.
 * These routes will be displayed as children of sidebar:unified/settings/*
 *
 */
export const settingsSidebar: Routes = [
  {
    path: '',
    redirectTo: 'legacy',
    pathMatch: 'full',
  },
  {
    path: 'legacy',
    component: SettingsComponent,
  },
  {
    path: 'endpoints',
    component: EndpointsComponent,
  },
  {
    path: 'experience',
    component: ExperienceComponent,
  },
  {
    path: 'tours',
    component: ToursComponent,
  },
];

/**
 * Routes that may be displayed in the "unified" sidebar as subroutes.
 * The unified sidebar includes a vertical navigation handler.
 */
export const unifiedSidebars: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    children: settingsSidebar,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'changelog',
    component: ChangelogComponent,
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
  },
  {
    path: 'contactus',
    component: ContactUsComponent,
  },
];

/**
 * Deprecated sidebar route redirects.
 */
export const oldRoutes: Routes = [
  {
    path: 'profile',
    redirectTo: 'unified/profile',
    outlet: 'sidebar',
  },
  {
    path: 'settings',
    redirectTo: 'unified/settings',
    outlet: 'sidebar',
  },
];

/**
 * Routes that may be displayed in the top-level sidebar as a standalone component.
 * These slide out from the right-hand side and display some data.
 */
export const sidebarRoutes: Routes = [
  ...oldRoutes,
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
  {
    path: 'contactus',
    component: ContactUsComponent,
    outlet: 'sidebar',
  },
  {
    path: 'unified',
    component: SidebarsComponent,
    outlet: 'sidebar',
    children: unifiedSidebars,
  },
];

/** Module containing all routable sidebar components. */
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(sidebarRoutes)],
  exports: [RouterModule],
})
export class SidebarsRouterModule {}
