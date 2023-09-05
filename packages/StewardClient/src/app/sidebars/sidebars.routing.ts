import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SidebarsComponent } from './sidebars.component';


/**
 * Routes that may be displayed in the "unified" sidebar as subroutes.
 * The unified sidebar includes a vertical navigation handler.
 */
export const unifiedSidebars: Routes = [
  {
    path: 'unified',
    component: SidebarsComponent,
    outlet: 'sidebar',
    children: [
      {
        path: '',
        redirectTo: 'settings',
        pathMatch: 'full',
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ]
  },
]

/**
 * Routes that may be displayed in the top-level sidebar as a standalone component.
 * These slide out from the right-hand side and display some data.
 */
export const originalSidebars: Routes = [
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
  {
    path: 'contactus',
    component: ContactUsComponent,
    outlet: 'sidebar',
  },
];

/** Routes for inclusion via ...sidebarRoutes in lazy-loaded child paths. */
export const sidebarRoutes: Routes = [
  ...originalSidebars,
  ...unifiedSidebars,
];

/** Module containing all routable sidebar components. */
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(sidebarRoutes),
  ],
  exports: [RouterModule],
})
export class SidebarsRouterModule {}
