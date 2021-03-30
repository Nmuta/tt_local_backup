import { RouteParams, RouterLinkPath, createRouterLinkPath } from '@models/routing';

/** Creates a CommunityPath for use in displaying the navbar, from a RouteParams object. */
export function createCommunityNavbarPath(routeParams: RouteParams): RouterLinkPath {
  return createRouterLinkPath(communityAppRootPath, routeParams);
}

/** The root path for all these tools. */
export const communityAppRootPath = ['/community/community-app', 'tools'];

/** Constants for tools in the community app. */
export class CommunityAppTools {
  /** The home page for the community app. */
  public static readonly HomePage: RouteParams = {
    title: 'Community App',
    path: 'home',
  };

  /** The gifting tool page. */
  public static readonly MessagingPage: RouteParams = {
    title: 'Messaging',
    path: 'messaging',
  };
}

/** The list of tools to display in the navbar. */
export const communityAppToolList: RouterLinkPath[] = [
  createCommunityNavbarPath(CommunityAppTools.MessagingPage),
];
