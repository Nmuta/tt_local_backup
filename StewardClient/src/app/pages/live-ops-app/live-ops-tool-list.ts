import { RouteParams, RouterLinkPath, createRouterLinkPath } from '@models/routing';
import { SharedNavbarTools } from '@shared/pages/shared-tool-list';

/** The root path for all these tools. */
export const liveOpsAppRootPath = ['/live-ops/live-ops-app', 'tools'];

/** Creates a LiveOps Path for use in displaying the navbar, from a RouteParams object. */
export function createLiveOpsNavbarPath(routeParams: RouteParams): RouterLinkPath {
  return createRouterLinkPath(liveOpsAppRootPath, routeParams);
}

/** Constants for tools in the live ops app. */
export class LiveOpsAppTools {
  /** The home page for the live ops app. */
  public static readonly HomePage: RouteParams = {
    title: 'Live Ops App',
    path: 'home',
  };
}

/** The list of tools to display in the navbar. */
export const liveOpsAppToolList: RouterLinkPath[] = [
  createLiveOpsNavbarPath(SharedNavbarTools.KustoManagementPage),
];
