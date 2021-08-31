import { ActivatedRoute } from '@angular/router';
import { first } from 'lodash';

/** Gets the activated route for 'tools' path. */
export function getToolsActivatedRoute(route: ActivatedRoute): ActivatedRoute {
  const foundToolsRoute = first(
    route.pathFromRoot.filter(p => p.snapshot.url.some(url => url.path == 'tools')),
  );
  if (!foundToolsRoute) {
    throw new Error('No valid "/tools" route found in ActivatedRoute path.');
  }

  return foundToolsRoute;
}
