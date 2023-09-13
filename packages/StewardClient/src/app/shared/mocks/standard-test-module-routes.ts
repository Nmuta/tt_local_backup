import { Routes } from '@angular/router';

/**
 * Routes that are considered "settings" configuration.
 * These routes will be displayed as children of sidebar:unified/settings/*
 *
 */
export const settingsSidebar: Routes = [
  {
    path: '',
    redirectTo: 'endpoints',
    pathMatch: 'full',
  },
  {
    path: 'endpoints',
  },
  {
    path: 'experience',
  },
  {
    path: 'tours',
  },
];

/**
 * Routes that may be displayed in the "unified" sidebar as subroutes.
 * The unified sidebar includes a vertical navigation handler.
 */
const unifiedSidebars: Routes = [
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
  },
  {
    path: 'changelog',
  },
  {
    path: 'notifications',
  },
  {
    path: 'contactus',
  },
];

/** Common routes for testing sidebar navigation. */
export const sidebarRoutes: Routes = [
  {
    path: 'unified',
    outlet: 'sidebar',
    children: unifiedSidebars,
  },
];
