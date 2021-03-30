import { RouteParams, RouterLinkPath, createRouterLinkPath } from '@models/routing';

/** Creates a LiveOps Path for use in displaying the navbar, from a RouteParams object. */
export function createLiveOpsNavbarPath(routeParams: RouteParams): RouterLinkPath {
  return createRouterLinkPath(liveOpsAppRootPath, routeParams);
}

/** The root path for all these tools. */
export const liveOpsAppRootPath = ['/live-ops/live-ops-app', 'tools'];

/** Constants for tools in the live ops app. */
export class LiveOpsAppTools {
  /** The home page for the live ops app. */
  public static readonly HomePage: RouteParams = {
    title: 'Live Ops App',
    path: 'home',
  };

  /** The gifting tool page. */
  public static readonly KustoPage: RouteParams = {
    title: 'Kusto',
    path: 'kusto',
  };
}

/** The list of tools to display in the navbar. */
export const liveOpsAppToolList: RouterLinkPath[] = [
  createLiveOpsNavbarPath(LiveOpsAppTools.KustoPage),
];
