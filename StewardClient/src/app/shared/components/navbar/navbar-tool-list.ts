/** A tool path and name. */

/** Parameters for generating a path displayed in the navbar. */
export interface RouteParams {
  readonly title: string;
  readonly path: string;
}

/** A path displayed in the navbar. */
export interface NavbarPath {
  readonly title: string;
  readonly routerLink: string[];
}

/** Creates a NavbarPath for use in displaying the navbar, from a RouteParams object. */
export function createNavbarPath(parentPath: string[], routeParams: RouteParams): NavbarPath {
  // tslint:disable-next-line: no-object-literal-type-assertion
  return <NavbarPath>{
    title: routeParams.title,
    routerLink: [...parentPath, routeParams.path],
  };
}

export const navbarAppRootPath = ['/navbar-app'];

/** Constants for tools in the navbar. */
export class NavbarTools {
  public static readonly GiftingPage: RouteParams = {
    title: 'Gifting',
    path: 'gifting',
  };
}

/** The list of tools to display in the navbar. */
export const navbarToolList: NavbarPath[] = [
  createNavbarPath(navbarAppRootPath, NavbarTools.GiftingPage),
  {
    title: '🦆 duck',
    routerLink: [...navbarAppRootPath, 'duck'],
  },
  {
    title: '🦆 duck',
    routerLink: [...navbarAppRootPath, 'duck'],
  },
  {
    title: '🦢 goose',
    routerLink: [...navbarAppRootPath, 'goose'],
  },
];
