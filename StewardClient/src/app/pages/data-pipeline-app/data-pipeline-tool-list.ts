import { RouteParams, RouterLinkPath, createRouterLinkPath } from '@models/routing';

/** Creates a Data Pipeline Path for use in displaying the navbar, from a RouteParams object. */
export function createDataPipelineNavbarPath(routeParams: RouteParams): RouterLinkPath {
  return createRouterLinkPath(dataPipelineAppRootPath, routeParams);
}

/** The root path for all these tools. */
export const dataPipelineAppRootPath = ['/data-pipeline/data-pipeline-app', 'tools'];

/** Constants for tools in the data pipeline app. */
export class DataPipelineAppTools {
  /** The home page for the data pipeline app. */
  public static readonly HomePage: RouteParams = {
    title: 'Data Pipeline App',
    path: 'home',
  };

  /** The home page for the data pipeline app. */
  public static readonly ObligationPage: RouteParams = {
    title: 'Obligation',
    path: 'obligation',
  };
}

/** The list of tools to display in the navbar. */
export const dataPipelineAppToolList: RouterLinkPath[] = [
  createDataPipelineNavbarPath(DataPipelineAppTools.ObligationPage),
];
