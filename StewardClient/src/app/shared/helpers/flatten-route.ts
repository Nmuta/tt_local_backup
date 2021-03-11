import { ActivatedRouteSnapshot } from '@angular/router';

// TODO: May be able to use this to expand sidebars without 3 subscribes.

/** Turns a nested route.children.children.children into a single layer. */
export function flattenRouteChildren(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot[] {
  const children = [route];
  for (let i = 0; i < children.length; i++) {
    children.push(...children[i].children);
  }
  return children;
}
