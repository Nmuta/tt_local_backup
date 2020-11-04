/** A tool path and name. */

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

/** Creates a NavbarPath for use in displaying the navbar, from a RouteParams object. */
export function createNavbarPath(routeParams: RouteParams): RouterLinkPath {
  return createRouterLinkPath(navbarAppRootPath, routeParams);
}

/** Creates a RouterLinkPath for use in displaying navbars, from a RouteParams object. */
export function createRouterLinkPath(
  parentPath: string[],
  routeParams: RouteParams
): RouterLinkPath {
  // tslint:disable-next-line: no-object-literal-type-assertion
  return <RouterLinkPath>{
    title: routeParams.title,
    routerLink: [...parentPath, routeParams.path],
  };
}

export const navbarAppRootPath = ['/navbar-app'];

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

  /** The user details tool page. */
  public static readonly UserDetailsPage: RouteParams = {
    title: 'User Details',
    path: 'user-details',
  };
}

/** The list of tools to display in the navbar. */
export const navbarToolList: RouterLinkPath[] = [
  createNavbarPath(NavbarTools.GiftingPage),
  createNavbarPath(NavbarTools.UserDetailsPage),
];
