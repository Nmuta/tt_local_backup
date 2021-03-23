import { createRouterLinkPath, RouteParams, RouterLinkPath } from '@models/routing';

/** Creates a NavbarPath for use in displaying the navbar, from a RouteParams object. */
export function createNavbarPath(routeParams: RouteParams): RouterLinkPath {
  return createRouterLinkPath(navbarAppRootPath, routeParams);
}

/** The root path for all these tools. */
export const navbarAppRootPath = ['/support/navbar-app', 'tools'];

/** Constants for tools in the navbar. */
export class NavbarTools {
  /** The home page for the navbar app. */
  public static readonly HomePage: RouteParams = {
    title: 'Home',
    path: 'home',
  };

  /** The gifting tool page. */
  public static readonly GiftingPage: RouteParams = {
    title: 'Gifting',
    path: 'gifting',
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
  createNavbarPath(NavbarTools.GiftingPage),
  createNavbarPath(NavbarTools.UserBanningPage),
  createNavbarPath(NavbarTools.GiftHistoryPage),
  createNavbarPath(NavbarTools.KustoPage),
];
