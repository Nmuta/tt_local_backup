/** A tool path and name. */
export interface NavbarPath {
  title: string,
  routerLink: string[],
}

export const navbarAppRootPath = "/navbar-app"
export const navbarToolList: NavbarPath[] = [
  {
    title: "🦆 duck",
    routerLink: [navbarAppRootPath, 'duck'],
  },
  {
    title: "🦆 duck",
    routerLink: [navbarAppRootPath, 'duck'],
  },
  {
    title: "🦢 goose",
    routerLink: [navbarAppRootPath, 'goose'],
  },
]