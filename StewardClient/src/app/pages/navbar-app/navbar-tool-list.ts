import { externalToolUrls } from '@environments/app-data/external-tool-urls';
import {
  RouteParams,
  RouterLinkPath,
  createRouterLinkPath,
  ExternalLinkPath,
} from '@models/routing';
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
}

/** The list of tools to display in the navbar. */
export const navbarToolList: RouterLinkPath[] = [
  createNavbarPath(SharedNavbarTools.UserDetailsPage),
  createNavbarPath(SharedNavbarTools.GiftingPage),
  createNavbarPath(SharedNavbarTools.GiftHistoryPage),
  createNavbarPath(SharedNavbarTools.UserBanningPage),
  createNavbarPath(SharedNavbarTools.KustoPage),
  createNavbarPath(SharedNavbarTools.AuctionBlocklistPage),
  createNavbarPath(SharedNavbarTools.BulkBanHistoryPage),
];

/** The list of tools to display in the navbar. */
export const navbarToolListAdminOnly: RouterLinkPath[] = [
  createNavbarPath(SharedNavbarTools.NotificationsPage),
];

/** The list of tools to display in the navbar. */
export const navbarExternalList: ExternalLinkPath[] = [
  {
    title: 'Salus Enforcement Tool',
    url: externalToolUrls.prod.salus,
  },
];
