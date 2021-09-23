import { RouteParams, RouterLinkPath, createRouterLinkPath } from '@models/routing';
import { SharedNavbarTools } from '@shared/pages/shared-tool-list';

/** The root path for all these tools. */
export const communityAppRootPath = ['/community/community-app', 'tools'];

/** Creates a CommunityPath for use in displaying the navbar, from a RouteParams object. */
export function createCommunityNavbarPath(routeParams: RouteParams): RouterLinkPath {
  return createRouterLinkPath(communityAppRootPath, routeParams);
}

/** Constants for tools in the community app. */
export class CommunityAppTools {
  /** The home page for the community app. */
  public static readonly HomePage: RouteParams = {
    title: 'Community App',
    path: 'home',
  };
}

/** The list of tools to display in the navbar. */
export const communityAppToolList: RouterLinkPath[] = [
  createCommunityNavbarPath(SharedNavbarTools.MessagingPage),
  createCommunityNavbarPath(SharedNavbarTools.GiftingPage),
  createCommunityNavbarPath(SharedNavbarTools.UGCPage),
  createCommunityNavbarPath(SharedNavbarTools.BulkBanHistoryPage),
];
