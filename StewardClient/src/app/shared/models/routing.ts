/** Parameters for generating a path displayed in the navbar. */
export interface RouteParams {
  readonly title: string;
  readonly path: string;
}

/** A path displayed in the navbar. */
export interface RouterLinkPath {
  readonly title: string;
  readonly routerLink: string[];
}

/** An external path displayed in the navbar. */
export interface ExternalLinkPath {
  readonly title: string;
  readonly url: string;
}

/** Creates a RouterLinkPath for use in displaying navbars, from a RouteParams object. */
export function createRouterLinkPath(
  parentPath: string[],
  routeParams: RouteParams,
): RouterLinkPath {
  // tslint:disable-next-line: no-object-literal-type-assertion
  return <RouterLinkPath>{
    title: routeParams.title,
    routerLink: [...parentPath, routeParams.path],
  };
}
