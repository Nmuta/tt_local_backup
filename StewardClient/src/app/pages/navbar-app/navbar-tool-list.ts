import { RouteParams, RouterLinkPath, createRouterLinkPath } from '@models/routing';
import { SharedNavbarTools } from '@shared/pages/shared-tool-list';

/** The root path for all these tools. */
export const navbarAppRootPath = ['/support/navbar-app', 'tools'];

/** Creates a NavbarPath for use in displaying the navbar, from a RouteParams object. */
export function createNavbarPath(routeParams: RouteParams): RouterLinkPath {
  return createRouterLinkPath(navbarAppRootPath, routeParams);
}

/** Constants for tools in the navbar. */
export class NavbarTools {
  /** The home page for the navbar app. */
  public static readonly HomePage: RouteParams = {
    title: 'Support App',
    path: 'home',
  };

  /** The gift history tool page. */
  public static readonly GiftHistoryPage: RouteParams = {
    title: 'Gift History',
    path: 'gift-history',
  };

  /** The user details tool page. */
  public static readonly UserDetailsPage: RouteParams = {
    title: 'Player Details',
    path: 'user-details',
  };

  /** The user banning tool page. */
  public static readonly UserBanningPage: RouteParams = {
    title: 'Banning',
    path: 'user-banning',
  };

  /** The Kusto tool page. */
  public static readonly KustoPage: RouteParams = {
    title: 'Kusto',
    path: 'kusto',
  };
}

/** The list of tools to display in the navbar. */
export const navbarToolList: RouterLinkPath[] = [
  createNavbarPath(NavbarTools.UserDetailsPage),
  createNavbarPath(SharedNavbarTools.GiftingPage),
  createNavbarPath(NavbarTools.UserBanningPage),
  createNavbarPath(NavbarTools.GiftHistoryPage),
  createNavbarPath(NavbarTools.KustoPage),
];

/** The list of tools to display in the navbar. */
export const navbarToolListAdminOnly: RouterLinkPath[] = [
  createNavbarPath(SharedNavbarTools.MessagingPage),
];
