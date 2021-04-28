import { RouteParams } from '@models/routing';
import { Router } from '@angular/router';
import { createNavbarPath } from '@navbar-app/navbar-tool-list';
import { createCommunityNavbarPath } from '@community-app/community-tool-list';
import { createDataPipelineNavbarPath } from '@data-pipeline-app/data-pipeline-tool-list';

/** Generates a shared page router based on the first indexed path in the URL. */
export function generateSharedPageRouterLink(router: Router, routeParams: RouteParams): string[] {
  const pathArr = router.url.split('/')?.filter(x => !!x && x !== '');
  const firstRouteInPath = pathArr[0];

  let rootRouterLink: string[] = [];
  switch (firstRouteInPath) {
    case 'support':
      rootRouterLink = createNavbarPath(routeParams).routerLink;
      break;
    case 'community':
      rootRouterLink = createCommunityNavbarPath(routeParams).routerLink;
      break;
    case 'data-pipeline':
      rootRouterLink = createDataPipelineNavbarPath(routeParams).routerLink;
      break;
    default:
      throw new Error('Page URL does not have a valid path to pull shared router link from.');
  }

  return rootRouterLink;
}
