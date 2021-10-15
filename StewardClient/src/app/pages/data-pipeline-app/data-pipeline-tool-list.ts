import { RouteParams, RouterLinkPath, createRouterLinkPath } from '@models/routing';
import { SharedNavbarTools } from '@shared/pages/shared-tool-list';

/** The root path for all these tools. */
export const dataPipelineAppRootPath = ['/data-pipeline/data-pipeline-app', 'tools'];

/** Creates a Data Pipeline Path for use in displaying the navbar, from a RouteParams object. */
export function createDataPipelineNavbarPath(routeParams: RouteParams): RouterLinkPath {
  return createRouterLinkPath(dataPipelineAppRootPath, routeParams);
}

/** Constants for tools in the data pipeline app. */
export class DataPipelineAppTools {
  /** The home page for the data pipeline app. */
  public static readonly HomePage: RouteParams = {
    title: 'Data Pipeline App',
    path: 'home',
  };
}

/** The list of tools to display in the navbar. */
export const dataPipelineAppToolList: RouterLinkPath[] = [
  createDataPipelineNavbarPath(SharedNavbarTools.ObligationPage),
];
